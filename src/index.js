const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

// Create Order (Stripe)
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a new Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to the smallest currency unit (e.g., cents)
      currency,
    });

    res.json({
      clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send(error.message);
  }
});

// Verify Payment (Stripe)
app.post('/verify-payment', async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  try {
    // Confirm the payment with the provided payment method ID
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { payment_method: paymentMethodId }
    );

    if (paymentIntent.status === 'succeeded') {
      res.send({ status: 'success' });
    } else {
      res.status(400).send({ status: 'failure' });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send(error.message);
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
