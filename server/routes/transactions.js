const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// All routes here require a valid login token
router.use(authenticateToken);

router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router; 
