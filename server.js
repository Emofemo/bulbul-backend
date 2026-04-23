const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ MongoDB URL ENV'DEN GELİR (BURAYA YAZMA)
mongoose.connect(process.env.MONGO_URL);

// ================= MODELS =================
const Listing = mongoose.model("Listing", {
  title: String,
  price: String,
  image: String,
  category: String,
  owner: String,
  createdAt: { type: Date, default: Date.now }
});

// ================= ROUTES =================
app.get("/listing", async (req, res) => {
  const data = await Listing.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post("/listing", async (req, res) => {
  const item = await Listing.create(req.body);
  res.json(item);
});

// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("BulBul server running 🚀"));