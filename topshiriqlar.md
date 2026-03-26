# JavaScript — Fetch + Async/Await + DOM Topshiriqlari
**Daraja:** Intern  
**Loyiha:** ShopPanel — Mahsulotlar Boshqaruv Tizimi  
**Fayl:** `frontend/app.js`

---

## 🗂️ Papka Tuzilmasi

```
shop-app/
├── backend/
│   ├── server.js       ✅ tayyor
│   ├── db.json         ✅ tayyor
│   └── package.json    ✅ tayyor
│
└── frontend/
    ├── index.html      ✅ tayyor
    ├── style.css       ✅ tayyor (index.html ichida)
    └── app.js          ✏️ SEN YOZASAN
```

---

## ⚙️ Ishga Tushirish

```bash
# 1 — Backendni yoqish
cd backend
npm install
node server.js

# 2 — Frontendni brauzerda ochish
# frontend/index.html faylini brauzerda oching
# (VS Code Live Server yoki to'g'ridan-to'g'ri)
```

---

## 📡 API Ma'lumotnomasi

> Barcha so'rovlar `http://localhost:3000` ga yuboriladi.

---

### `GET /products`
**Barcha mahsulotlarni olish**

```
So'rov:  GET http://localhost:3000/products
Body:    yo'q
```

```json
// ✅ Muvaffaqiyatli javob — 200 OK
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Noutbuk",
      "price": 8500000,
      "category": "Elektronika",
      "stock": 15,
      "createdAt": "2024-01-10T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Telefon",
      "price": 3200000,
      "category": "Elektronika",
      "stock": 40,
      "createdAt": "2024-01-11T10:30:00.000Z"
    }
    // ... boshqa mahsulotlar
  ]
}
```

---

### `GET /products/:id`
**Bitta mahsulotni olish**

```
So'rov:  GET http://localhost:3000/products/1
Body:    yo'q
```

```json
// ✅ Topildi — 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Noutbuk",
    "price": 8500000,
    "category": "Elektronika",
    "stock": 15,
    "createdAt": "2024-01-10T09:00:00.000Z"
  }
}
```

```json
// ❌ Topilmadi — 404 Not Found
{
  "success": false,
  "message": "Mahsulot topilmadi"
}
```

---

### `POST /products`
**Yangi mahsulot qo'shish**

```
So'rov:  POST http://localhost:3000/products
Headers: { "Content-Type": "application/json" }
Body:    (quyidagi JSON)
```

```json
// 📤 Yuborilayotgan body
{
  "name": "Televizor",
  "price": 4500000,
  "category": "Elektronika",
  "stock": 20
}
```

```json
// ✅ Qo'shildi — 201 Created
{
  "success": true,
  "message": "Mahsulot muvaffaqiyatli qo'shildi",
  "data": {
    "id": 6,
    "name": "Televizor",
    "price": 4500000,
    "category": "Elektronika",
    "stock": 20,
    "createdAt": "2024-03-15T12:00:00.000Z"
  }
}
```

```json
// ❌ Maydon yetishmasa — 400 Bad Request
{
  "success": false,
  "message": "Barcha maydonlar to'ldirilishi shart: name, price, category, stock"
}
```

```json
// ❌ Narx noto'g'ri — 400 Bad Request
{
  "success": false,
  "message": "Narx musbat son bo'lishi kerak"
}
```

---

### `PUT /products/:id`
**Mahsulotni yangilash**

```
So'rov:  PUT http://localhost:3000/products/1
Headers: { "Content-Type": "application/json" }
Body:    (quyidagi JSON)
```

```json
// 📤 Yuborilayotgan body
{
  "name": "Noutbuk Pro",
  "price": 9800000,
  "category": "Elektronika",
  "stock": 10
}
```

```json
// ✅ Yangilandi — 200 OK
{
  "success": true,
  "message": "Mahsulot muvaffaqiyatli yangilandi",
  "data": {
    "id": 1,
    "name": "Noutbuk Pro",
    "price": 9800000,
    "category": "Elektronika",
    "stock": 10,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-03-15T14:30:00.000Z"
  }
}
```

```json
// ❌ Topilmadi — 404 Not Found
{
  "success": false,
  "message": "Mahsulot topilmadi"
}
```

---

### `DELETE /products/:id`
**Mahsulotni o'chirish**

```
So'rov:  DELETE http://localhost:3000/products/1
Body:    yo'q
```

```json
// ✅ O'chirildi — 200 OK
{
  "success": true,
  "message": "Mahsulot muvaffaqiyatli o'chirildi",
  "data": {
    "id": 1,
    "name": "Noutbuk",
    "price": 8500000,
    "category": "Elektronika",
    "stock": 15,
    "createdAt": "2024-01-10T09:00:00.000Z"
  }
}
```

```json
// ❌ Topilmadi — 404 Not Found
{
  "success": false,
  "message": "Mahsulot topilmadi"
}
```

---

## ✏️ Topshiriqlar

> Barcha ishlar `frontend/app.js` faylida bajariladi.
> `index.html` va `style.css` ga **teginmang**.

---

### 📌 1-Topshiriq — DOM elementlarini tanlash

`app.js` faylini yozing va quyidagi o'zgaruvchilarni aniqlang:

```js
const API_URL = "http://localhost:3000/products";

// index.html dan quyidagi elementlarni getElementById bilan tanlang:
// tbody         → id="products-tbody"
// formTitle     → id="form-title"
// formDot       → id="form-dot"
// productId     → id="product-id"
// productName   → id="product-name"
// productPrice  → id="product-price"
// productCat    → id="product-category"
// productStock  → id="product-stock"
// saveBtn       → id="save-btn"
// saveLabel     → id="save-label"
// saveIcon      → id="save-icon"
// cancelBtn     → id="cancel-btn"
// searchInput   → id="search-input"
// statTotal     → id="stat-total"
// statValue     → id="stat-value"
// statLow       → id="stat-low"
// toast         → id="toast"
```

---

### 📌 2-Topshiriq — Yordamchi funksiyalar

Quyidagi yordamchi funksiyalarni yozing:

```js
// 1. formatPrice(price)
//    8500000 → "8 500 000 so'm"
//    Number.toLocaleString("uz-UZ") ishlatish mumkin

// 2. getBadgeClass(category)
//    "Elektronika" → "badge badge-elektronika"
//    "Mebel"       → "badge badge-mebel"
//    "Aksesuar"    → "badge badge-aksesuar"
//    boshqalar     → "badge badge-default"

// 3. getStockClass(stock)
//    0          → "stock-val stock-zero"
//    1–5        → "stock-val stock-low"
//    6 va yuqori→ "stock-val stock-ok"

// 4. showToast(message, type)
//    toast elementiga text yozadi
//    type: "success" yoki "error"
//    "show" klassini qo'shadi
//    2.5 soniyadan keyin "show" klassini olib tashlaydi

// 5. resetForm()
//    Barcha input larni tozalaydi
//    productId.value = ""
//    formTitle.textContent = "Yangi Mahsulot"
//    formDot.className = "dot"
//    saveLabel.textContent = "Qo'shish"
//    saveIcon.textContent = "＋"
//    cancelBtn.style.display = "none"
```

---

### 📌 3-Topshiriq — Statistikani yangilash

```js
// updateStats(products) funksiyasini yozing.
// Parametr: mahsulotlar massivi

// 1. statTotal ga mahsulotlar sonini yozing
// 2. statValue ga barcha mahsulotlarning umumiy qiymatini yozing
//    (har bir mahsulot uchun price * stock, yig'indisi)
//    formatPrice() orqali formatlang
// 3. statLow ga stock === 0 bo'lgan mahsulotlar sonini yozing
```

---

### 📌 4-Topshiriq — Mahsulotlarni jadvalga chizish

```js
// renderProducts(products) funksiyasini yozing.

// 1. tbody.innerHTML = "" — jadvalni tozalang
// 2. Agar products bo'sh massiv bo'lsa:
//    tbody ga bitta <tr> qo'shing:
//    <td colspan="6"> ichida bo'sh holatni ko'rsating

// 3. Har bir mahsulot uchun <tr> yarating:
//    - 1-td: mahsulot id si (.td-id klassi bilan)
//    - 2-td: mahsulot nomi (.td-name klassi bilan)
//    - 3-td: narxi formatlanib (.td-price klassi bilan)
//    - 4-td: kategoriya (getBadgeClass() dan kelgan klass bilan <span>)
//    - 5-td: ombor soni (getStockClass() dan kelgan klass bilan)
//    - 6-td: ikki tugma
//         "✏ Tahrirlash" → onclick="editProduct(mahsulot ob'ekti)"
//         "✕ O'chirish"  → onclick="deleteProduct(mahsulot.id)"
//         (btn btn-icon btn-edit / btn-delete klasslari bilan)

// 4. Jadvalga qo'shing va updateStats(products) ni chaqiring
```

---

### 📌 5-Topshiriq — GET: Mahsulotlarni yuklash

```js
// loadProducts() nomli async funksiya yozing.

// 1. fetch(API_URL) ga GET so'rov yuboring (await)
// 2. Javobni .json() bilan parsing qiling (await)
// 3. data.data (mahsulotlar massivi) ni allProducts o'zgaruvchisiga saqlang
//    (allProducts ni modul darajasida e'lon qiling — qidiruv uchun kerak)
// 4. renderProducts(allProducts) ni chaqiring
// 5. Xato bo'lsa showToast("Ma'lumot yuklab bo'lmadi", "error") chaqiring

// Sahifa yuklanganda avtomatik chaqirilsin:
loadProducts();
```

---

### 📌 6-Topshiriq — POST: Yangi mahsulot qo'shish

```js
// addProduct() nomli async funksiya yozing.

// 1. Input lardan qiymatlarni oling:
//    name, price (Number), category, stock (Number)

// 2. Validatsiya:
//    - name bo'sh bo'lmasin
//    - price 0 dan katta bo'lsin
//    - category bo'sh bo'lmasin
//    - stock 0 dan kichik bo'lmasin
//    Xato bo'lsa showToast("...", "error") va return

// 3. fetch(API_URL, {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({ name, price, category, stock })
//    }) ga so'rov yuboring (await)

// 4. Javobni .json() qiling (await)

// 5. Muvaffaqiyatli bo'lsa (response.ok):
//    - resetForm()
//    - loadProducts()
//    - showToast("Mahsulot qo'shildi!", "success")

// 6. Xato bo'lsa:
//    - showToast(data.message, "error")
```

---

### 📌 7-Topshiriq — Tahrirlash rejimini yoqish

```js
// editProduct(product) funksiyasini yozing.
// Bu funksiya tugmaga bosilganda formani tahrirlash rejimiga o'tkazadi.

// 1. productId.value = product.id
// 2. productName.value = product.name
// 3. productPrice.value = product.price
// 4. productCat.value = product.category
// 5. productStock.value = product.stock
// 6. formTitle.textContent = "Mahsulotni Tahrirlash"
// 7. formDot.classList.add("edit")  (sariq rangga o'tadi)
// 8. saveLabel.textContent = "Saqlash"
// 9. saveIcon.textContent = "✔"
// 10. cancelBtn.style.display = "block"
// 11. Forma ko'rinib turishi uchun form-card elementiga scroll qiling:
//     document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" })
```

---

### 📌 8-Topshiriq — PUT: Mahsulotni yangilash

```js
// updateProduct(id) nomli async funksiya yozing.

// 1. Input lardan yangi qiymatlarni oling
// 2. Validatsiya (addProduct dagi kabi)
// 3. fetch(`${API_URL}/${id}`, {
//      method: "PUT",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({ name, price, category, stock })
//    }) ga so'rov yuboring (await)
// 4. Javobni .json() qiling (await)
// 5. Muvaffaqiyatli bo'lsa:
//    - resetForm()
//    - loadProducts()
//    - showToast("Mahsulot yangilandi!", "success")
// 6. Xato bo'lsa showToast(data.message, "error")
```

---

### 📌 9-Topshiriq — DELETE: Mahsulotni o'chirish

```js
// deleteProduct(id) nomli async funksiya yozing.

// 1. confirm(`ID: ${id} mahsulotni o'chirmoqchimisiz?`)
//    Foydalanuvchi "Bekor qilish" bosса — to'xtang (return)

// 2. fetch(`${API_URL}/${id}`, { method: "DELETE" }) (await)
// 3. Javobni .json() qiling (await)
// 4. Muvaffaqiyatli bo'lsa:
//    - loadProducts()
//    - showToast("Mahsulot o'chirildi", "success")
// 5. Xato bo'lsa showToast(data.message, "error")
```

---

### 📌 10-Topshiriq — Saqlash tugmasi (event listener)

```js
// saveBtn ga "click" event listener qo'shing.

// Agar productId.value bo'sh bo'lsa:
//   → addProduct() ni chaqiring

// Agar productId.value bo'sh bo'lmasa:
//   → updateProduct(productId.value) ni chaqiring
```

---

### 📌 11-Topshiriq — Bekor qilish tugmasi

```js
// cancelBtn ga "click" event listener qo'shing.
// Bosilganda resetForm() ni chaqiring.
```

---

### 📌 12-Topshiriq — Qidiruv

```js
// searchInput ga "input" event listener qo'shing.

// 1. searchInput.value ni kichik harfga o'tkazing (toLowerCase)
// 2. allProducts massividan filter qiling:
//    mahsulot nomi YOKI kategoriyasi qidiruv matni bilan mos kelsa
// 3. renderProducts(filteredProducts) ni chaqiring

// MUHIM: loadProducts() ga qayta so'rov YUBORMANG —
// allProducts massividan frontendda filtrlang.
```

---

