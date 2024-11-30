const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Check payment cycle status
app.get('/api/payment-cycle/:sheetType', async (req, res) => {
  try {
    const { sheetType } = req.params;
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    let isActive = false;
    if (sheetType === 'WEEKLY') {
      // Active on Friday (5) or Monday (1)
      isActive = dayOfWeek === 1 || dayOfWeek === 5;
    } else if (sheetType === 'EARLY') {
      // Always active for early payments
      isActive = true;
    }

    res.json({
      isActive,
      message: isActive ? 'Payment cycle is active' : 'Payment cycle is not active'
    });
  } catch (error) {
    console.error('Error checking payment cycle:', error);
    res.status(500).json({ error: 'Failed to check payment cycle' });
  }
});

// Process payments
app.post('/api/process-payment/:sheetType', async (req, res) => {
  try {
    const { sheetType } = req.params;
    const currentDate = new Date();
    let startDate = new Date(currentDate);

    // Calculate start date based on sheet type
    if (sheetType === 'WEEKLY') {
      // Get last Monday
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(currentDate.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (sheetType === 'EARLY') {
      // Last 2 days
      startDate.setDate(currentDate.getDate() - 2);
      startDate.setHours(0, 0, 0, 0);
    }

    // Get eligible orders
    const orders = await prisma.orders.findMany({
      where: {
        shippingDate: {
          gte: startDate,
          lte: currentDate
        },
        status: 'DELIVERED'
      }
    });

    // Calculate totals
    const totalAmount = orders.reduce((sum, order) => sum + (order.orderRate || 0), 0);

    res.json({
      success: true,
      processedCount: orders.length,
      totalAmount,
      orders
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});