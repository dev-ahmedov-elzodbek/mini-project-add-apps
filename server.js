import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5500;
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());


function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(list) {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.id)) + 1;
}

// ─────────────────────────────────────────
//  GET /products — Barcha mahsulotlar
// ─────────────────────────────────────────
app.get("/products", (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.products.length,
      data: db.products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server xatosi", error: err.message });
  }
});

// ─────────────────────────────────────────
//  GET /products/:id — Bitta mahsulot
// ─────────────────────────────────────────
app.get("/products/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const product = db.products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server xatosi", error: err.message });
  }
});

// ─────────────────────────────────────────
//  POST /products — Yangi mahsulot qo'shish
// ─────────────────────────────────────────
app.post("/products", (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Barcha maydonlar to'ldirilishi shart: name, price, category, stock",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ success: false, message: "Narx musbat son bo'lishi kerak" });
    }

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ success: false, message: "Ombor miqdori 0 yoki undan katta bo'lishi kerak" });
    }

    const db = readDB();
    const newProduct = {
      id: generateId(db.products),
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      createdAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    writeDB(db);

    res.status(201).json({ success: true, message: "Mahsulot muvaffaqiyatli qo'shildi", data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server xatosi", error: err.message });
  }
});

// ─────────────────────────────────────────
//  PUT /products/:id — Mahsulotni yangilash
// ─────────────────────────────────────────
app.put("/products/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }

    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Barcha maydonlar to'ldirilishi shart: name, price, category, stock",
      });
    }

    const updatedProduct = {
      ...db.products[index],
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      updatedAt: new Date().toISOString(),
    };

    db.products[index] = updatedProduct;
    writeDB(db);

    res.status(200).json({ success: true, message: "Mahsulot muvaffaqiyatli yangilandi", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server xatosi", error: err.message });
  }
});

// ─────────────────────────────────────────
//  DELETE /products/:id — Mahsulotni o'chirish
// ─────────────────────────────────────────
app.delete("/products/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
    }

    const deleted = db.products[index];
    db.products = db.products.filter((p) => p.id !== id);
    writeDB(db);

    res.status(200).json({ success: true, message: "Mahsulot muvaffaqiyatli o'chirildi", data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server xatosi", error: err.message });
  }
});

// ─────────────────────────────────────────
//  404 — Noto'g'ri route
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `${req.method} ${req.url} — bunday endpoint mavjud emas` });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`📦 Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/products`);
  console.log(`   GET    http://localhost:${PORT}/products/:id`);
  console.log(`   POST   http://localhost:${PORT}/products`);
  console.log(`   PUT    http://localhost:${PORT}/products/:id`);
  console.log(`   DELETE http://localhost:${PORT}/products/:id\n`);
});
