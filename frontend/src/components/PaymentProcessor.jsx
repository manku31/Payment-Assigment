import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentProcessor = () => {
  const [weeklyActive, setWeeklyActive] = useState(false);
  const [earlyActive, setEarlyActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const checkPaymentCycles = async () => {
    try {
      const [weeklyRes, earlyRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/payment-cycle/WEEKLY`),
        fetch(`${import.meta.env.VITE_API_URL}/payment-cycle/EARLY`)
      ]);

      const weeklyData = await weeklyRes.json();
      const earlyData = await earlyRes.json();

      setWeeklyActive(weeklyData.isActive);
      setEarlyActive(earlyData.isActive);
    } catch (err) {
      setError('Failed to check payment cycle status');
    }
  };

  useEffect(() => {
    checkPaymentCycles();
    const interval = setInterval(checkPaymentCycles, 300000);
    return () => clearInterval(interval);
  }, []);

  const processPayment = async (sheetType) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/process-payment/${sheetType}`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to process payments');
      }
    } catch (err) {
      setError('An error occurred while processing payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Payment Processing</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Payment Sheet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Process payments for orders delivered in the previous week (Monday to Sunday)
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm font-medium ${weeklyActive ? 'text-green-600' : 'text-yellow-600'}`}>
                {weeklyActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Button 
              className="w-full"
              disabled={!weeklyActive || loading}
              onClick={() => processPayment('WEEKLY')}
            >
              {loading ? 'Processing...' : 'Process Weekly Payments'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Early Payment Sheet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Process payments for orders delivered in the last 2 days
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm font-medium ${earlyActive ? 'text-green-600' : 'text-yellow-600'}`}>
                {earlyActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Button 
              className="w-full"
              disabled={!earlyActive || loading}
              onClick={() => processPayment('EARLY')}
            >
              {loading ? 'Processing...' : 'Process Early Payments'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Processed Orders</p>
                <p className="text-2xl font-bold">{result.processedCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">₹{result.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentProcessor;