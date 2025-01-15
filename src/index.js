// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const sequelize = require("./config/database"); // Database connection
// const userRoutes = require("./routes/userRoutes"); // User routes
// const cardRoutes = require("./routes/cardRoutes"); // Card routes

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(
//   morgan(
//     ':remote-addr - :remote-user - [:date[clf]] - ":method :url HTTP/:http-version" - :status - :res[content-length] B - :response-time ms'
//   )
// );

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/cards", cardRoutes);

// app.post('/create-order', async (req, res) => {
//   const { amount, currency } = req.body;

//   // Validate input
//   if (!amount || isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ error: "Invalid amount. Amount must be a positive number." });
//   }
//   if (!currency || typeof currency !== 'string') {
//     return res.status(400).json({ error: "Invalid currency. Currency must be a string." });
//   }

//   try {
//     // Create a new Stripe PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to the smallest currency unit (e.g., cents)
//       currency,
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ error: error.message }); // Always return JSON
//   }
// });

// // Verify Payment (Stripe)
// app.post('/verify-payment', async (req, res) => {
//   const { paymentIntentId } = req.body;

//   // Validate input
//   if (!paymentIntentId || typeof paymentIntentId !== 'string') {
//     return res.status(400).send({ error: "Invalid paymentIntentId." });
//   }

//   try {
//     // Retrieve the payment intent
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     // Check the payment intent status
//     if (paymentIntent.status === 'succeeded') {
//       res.send({ status: 'success', paymentIntent });
//     } else {
//       res.status(400).send({ status: 'failure', paymentIntent });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).send({ error: error.message });
//   }
// });

// // Database Sync and Server Start
// (async function startServer() {
//   try {
//     await sequelize.authenticate();
//     console.log("Database connected...");
    
//     await sequelize.sync({ alter: false }); // Synchronize models
//     console.log("Models synced...");

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   } catch (error) {
//     console.error("Error starting server:", error);
//   }
// })();


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

// Create Order (Stripe PaymentIntent)
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  // Validate input
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount. Amount must be a positive number." });
  }
  if (!currency || typeof currency !== 'string') {
    return res.status(400).json({ error: "Invalid currency. Currency must be a string." });
  }

  try {
    // Create a new Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to the smallest currency unit (e.g., cents)
      currency,
    });

    res.json({
      clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message }); // Always return JSON
  }
});

// Verify Payment (Stripe)
app.post('/verify-payment', async (req, res) => {
  const { paymentIntentId } = req.body;

  // Validate input
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return res.status(400).send({ error: "Invalid paymentIntentId." });
  }

  try {
    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check the payment intent status
    if (paymentIntent.status === 'succeeded') {
      res.send({ status: 'success', paymentIntent });
    } else {
      res.status(400).send({ status: 'failure', paymentIntent });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send({ error: error.message });
  }
});

// Create Checkout Session (Stripe Checkout)
app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency, successUrl, cancelUrl } = req.body;

  // Validate input
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount. Amount must be a positive number." });
  }
  if (!currency || typeof currency !== "string") {
    return res.status(400).json({ error: "Invalid currency. Currency must be a string." });
  }
  if (!successUrl || typeof successUrl !== "string") {
    return res.status(400).json({ error: "Invalid success URL." });
  }
  if (!cancelUrl || typeof cancelUrl !== "string") {
    return res.status(400).json({ error: "Invalid cancel URL." });
  }

  try {
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Pokemon Card Grading",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl, // Redirect URL after successful payment
      cancel_url: cancelUrl, // Redirect URL if payment is canceled
    });

    res.json({ id: session.id }); // Return the session ID to the frontend
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
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