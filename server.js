const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin:Admin1905@bulbul.a6srjlv.mongodb.net/?appName=bulbul");

// MODELS
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: { type: String, default: "user" },
  banned: { type: Boolean, default: false },
  favorites: [String]
});

const Listing = mongoose.model("Listing", {
  title: String,
  price: String,
  image: String,
  category: String,
  owner: String,
  createdAt: { type: Date, default: Date.now }
});

// AUTH
app.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password: hash });
  res.json(user);
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Yok");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).send("Hatalı");
  if (user.banned) return res.send("BANLANDIN");

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");
  res.json({ token, email: user.email });
});

// LISTINGS
app.post("/listing", async (req, res) => {
  const l = await Listing.create(req.body);
  res.json(l);
});

app.get("/listing", async (req, res) => {
  res.json(await Listing.find().sort({ createdAt: -1 }));
});

// FAVORITES
app.post("/fav", async (req, res) => {
  await User.updateOne({ email: req.body.email }, { $push: { favorites: req.body.id } });
  res.send("ok");
});

// ADMIN BAN
app.post("/ban", async (req, res) => {
  await User.updateOne({ email: req.body.email }, { banned: true });
  res.send("Banlandı");
});

app.listen(3000, () => console.log("SERVER READY 🚀"));