
# Payment Processor Application

This repository contains the source code for the Payment Processor application, which includes both the **frontend** and **backend**. Follow the steps below to set up the application on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) or another database of your choice
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## Project Structure

```
payment-processor/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env
│   └── package.json
```

---

## Backend Setup

1. Clone the repository and navigate to the `backend` directory:

   ```bash
   git clone https://github.com/manku31/Payment-Processor-Application.git
   cd payment-processor/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the `backend` directory and add the following:

   ```env
   DATABASE_URL="your-database-url"
   PORT=3001
   ```

   Replace `your-database-url` with the connection string for your database.

4. Initialize and configure the database using Prisma:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:3001`.

---

## Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the `frontend` directory and add the following:

   ```env
   VITE_API_URL="http://localhost:3001/api"
   ```

   Ensure the URL matches the backend API URL.

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend server will run on `http://localhost:5173`.

---

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server in a new terminal:

   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Backend: [http://localhost:3001](http://localhost:3001)
   - Frontend: [http://localhost:5173](http://localhost:5173)

---

## Feedback & Support

If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request.

---

**Happy Coding!** 🚀
