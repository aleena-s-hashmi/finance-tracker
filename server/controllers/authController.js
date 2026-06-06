const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

// Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password — never store plain text passwords
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password with stored hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create a JWT token — this is what the frontend stores and sends with requests
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { register, login }; 
