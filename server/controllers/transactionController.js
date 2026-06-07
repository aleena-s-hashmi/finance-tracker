const prisma = require("../prisma/client");

// Get all transactions for the logged-in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single transaction
const getTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: Number(id), userId: req.user.userId },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Create a new transaction
const createTransaction = async (req, res) => {
  const { amount, type, category, description, date } = req.body;

  // Basic validation
  if (!amount || !type || !category || !date) {
    return res.status(400).json({ error: "amount, type, category and date are required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ error: "type must be income or expense" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.userId,
        amount: parseFloat(amount),
        type,
        category,
        description: description || "",
        date: new Date(date),
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, description, date } = req.body;

  try {
    // Make sure the transaction belongs to this user
    const existing = await prisma.transaction.findFirst({
      where: { id: Number(id), userId: req.user.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        amount: amount ? parseFloat(amount) : existing.amount,
        type: type || existing.type,
        category: category || existing.category,
        description: description ?? existing.description,
        date: date ? new Date(date) : existing.date,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    // Make sure the transaction belongs to this user
    const existing = await prisma.transaction.findFirst({
      where: { id: Number(id), userId: req.user.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await prisma.transaction.delete({ where: { id: Number(id) } });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}; 
