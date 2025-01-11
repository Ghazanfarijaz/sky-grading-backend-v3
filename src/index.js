const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/database"); // Database connection
const userRoutes = require("./routes/userRoutes"); // User routes
const cardRoutes = require("./routes/cardRoutes"); // Card routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ':remote-addr - :remote-user - [:date[clf]] - ":method :url HTTP/:http-version" - :status - :res[content-length] B - :response-time ms'
  )
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);

app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paisa
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', 'YOUR_RAZORPAY_SECRET');
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.send({ status: 'success' });
  } else {
    res.status(400).send({ status: 'failure' });
  }
});


// Database Sync and Server Start
(async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    
    await sequelize.sync({ alter: false }); // Synchronize models
    console.log("Models synced...");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();
