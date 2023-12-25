const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Create Product at localhost:5000/api/buy/payment
router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "USD",
    },
    (StripeErr, StripeRes) => {
      if (StripeErr) {
        res.status(404).json(StripeErr);
      } else {
        res.status(200).json(StripeRes);
      }
    }
  );
});

module.exports = router;
