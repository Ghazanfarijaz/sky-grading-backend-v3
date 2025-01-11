const express = require("express");
const { 
  addCard, 
  getAllCards, 
  getCardByCardNumber, 
  updateCardTrackingStatus, 
  deleteCardByCardNumber, 
  getCardByUserId, 
  getCardByUserIdAndCardNumber,
  updateCard
} = require("../controllers/cardController");

const router = express.Router();

// Route to add a new card
router.post("/add", addCard);

// Route to fetch all cards
router.get("/", getAllCards);

// Route to fetch card by card number
router.get("/:cardNumber", getCardByCardNumber);

// Route to fetch all cards by user ID
router.get("/user/:userId", getCardByUserId);

// Route to fetch card by user ID and card number
router.get("/user/:userId/:cardNumber", getCardByUserIdAndCardNumber);

// Route to update card tracking status
router.put("/update/:cardNumber", updateCardTrackingStatus);

router.put("/updateall/:cardNumber", updateCard); // Updated route name


// Route to delete card by card number
router.delete("/delete/:cardNumber", deleteCardByCardNumber);

module.exports = router;
