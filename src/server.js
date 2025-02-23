const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const env = require("dotenv");

env.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({origin: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Amazon clone backend API");
});

// API routes
app.post("/payments/create", async (req, res) => {
  try {
    const total= req.query.total;

    if (!total) {
      return res.status(400).send({error: "Total amount is required"});
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
    });
    
    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).send({error: error.message});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
