
// 1-Topshiriq  api url va dom elementlari

 
const API_URL = "http://localhost:5500/products";
 
const tbody        = document.getElementById("products-tbody");
const formTitle    = document.getElementById("form-title");
const formDot      = document.getElementById("form-dot");
const productId    = document.getElementById("product-id");
const productName  = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productCat   = document.getElementById("product-category");
const productStock = document.getElementById("product-stock");
const saveBtn      = document.getElementById("save-btn");
const saveLabel    = document.getElementById("save-label");
const saveIcon     = document.getElementById("save-icon");
const cancelBtn    = document.getElementById("cancel-btn");
const searchInput  = document.getElementById("search-input");
const statTotal    = document.getElementById("stat-total");
const statValue    = document.getElementById("stat-value");
const statLow      = document.getElementById("stat-low");
const toast        = document.getElementById("toast");
let allProducts = [];
 
 

// 2-Topshiriq yordamchi funksiyalar
 
function formatPrice(price) {
    return Number(price).toLocaleString("uz-UZ") + " so'm";
}

function getBadgeClass(category) {
   
    const cat = category.toLowerCase();
 
    if (cat === "elektronika") return "badge badge-elektronika";
    if (cat === "mebel")       return "badge badge-mebel";
    if (cat === "aksesuar")    return "badge badge-aksesuar";
 
    return "badge badge-default";
}
 
function getStockClass(stock) {
    if (stock === 0)  return "stock-val stock-zero";
    if (stock <= 5)   return "stock-val stock-low";
    return "stock-val stock-ok";
}

function showToast(message, type) {
    toast.textContent = message;
    toast.className = "show " + type;
 
    setTimeout(function() {
        toast.className = "";
    }, 2500);
}
 
function resetForm() {
    productId.value    = "";
    productName.value  = "";
    productPrice.value = "";
    productCat.value   = "";
    productStock.value = "";
 
    formTitle.textContent    = "Yangi Mahsulot";
    formDot.className        = "dot";
    saveLabel.textContent    = "Qo'shish";
    saveIcon.textContent     = "＋";
    cancelBtn.style.display  = "none";
}
 
 
// 3-Topshiriq statistikani yangilash
 
function updateStats(products) {
 
    statTotal.textContent = products.length;
 

    const totalSum = products.reduce(function(sum, product) {
        return sum + (product.price * product.stock);
    }, 0);
    statValue.textContent = formatPrice(totalSum);
 
    const lowCount = products.filter(function(product) {
        return product.stock === 0;
    }).length;
    statLow.textContent = lowCount;
}
 
 

// 4-Topshiriq  mahsulotlarni jadvalga chizish

 
function renderProducts(products) {
    
    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML =
            "<tr>" +
            "  <td colspan='6'>" +
            "    <div class='table-empty'>" +
            "      <div class='icon'>📦</div>" +
            "      <p>Mahsulotlar topilmadi</p>" +
            "    </div>" +
            "  </td>" +
            "</tr>";
        updateStats([]);
        return;
    }
 
    
    products.forEach(function(product) {
        const tr = document.createElement("tr");
 
        tr.innerHTML =
            "<td class='td-id'>" + product.id + "</td>" +
            "<td class='td-name'>" + product.name + "</td>" +
            "<td class='td-price'>" + formatPrice(product.price) + "</td>" +
            "<td><span class='" + getBadgeClass(product.category) + "'>" + product.category + "</span></td>" +
            "<td><span class='" + getStockClass(product.stock) + "'>" + product.stock + "</span></td>" +
            "<td class='td-actions'>" +
            "  <button class='btn btn-icon btn-edit' onclick='editProduct(" + JSON.stringify(product) + ")'>✏ Tahrirlash</button>" +
            "  <button class='btn btn-icon btn-delete' onclick='deleteProduct(" + product.id + ")'>✕ O\\'chirish</button>" +
            "</td>";
 
        tbody.appendChild(tr);
    });
 
    updateStats(products);
}
 
 
// 5-Topshiriq get mahsulotlarni yuklash

 
function loadProducts() {
    fetch(API_URL)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            allProducts = data.data;
            renderProducts(allProducts);
        })
        .catch(function() {
            showToast("Ma'lumot yuklab bo'lmadi", "error");
        });
}
 

loadProducts();
 
 

// 6-Topshiriq — post: yangi mahsulot qo'shish

 
function addProduct() {
    const name     = productName.value.trim();
    const price    = Number(productPrice.value);
    const category = productCat.value.trim();
    const stock    = Number(productStock.value);
 
   
    if (!name) {
        showToast("Mahsulot nomini kiriting!", "error");
        return;
    }
    if (!price || price <= 0) {
        showToast("Narx 0 dan katta bo'lishi kerak!", "error");
        return;
    }
    if (!category) {
        showToast("Kategoriyani kiriting!", "error");
        return;
    }
    if (stock < 0) {
        showToast("Ombor miqdori 0 dan kichik bo'lmasin!", "error");
        return;
    }
 
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price, category, stock })
    })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                resetForm();
                loadProducts();
                showToast("Mahsulot qo'shildi!", "success");
            } else {
                showToast(data.message, "error");
            }
        })
        .catch(function() {
            showToast("Xatolik yuz berdi!", "error");
        });
}
 
 
// 7-Topshiriq  tahrirlash rejimini yoqish

 
function editProduct(product) {
    productId.value    = product.id;
    productName.value  = product.name;
    productPrice.value = product.price;
    productCat.value   = product.category;
    productStock.value = product.stock;
 
    formTitle.textContent   = "Mahsulotni Tahrirlash";
    formDot.className       = "dot edit";
    saveLabel.textContent   = "Saqlash";
    saveIcon.textContent    = "✔";
    cancelBtn.style.display = "block";
 
  
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
}
 
 

// 8-Topshiriq — put: mahsulotni yangilash
 
function updateProduct(id) {
    const name     = productName.value.trim();
    const price    = Number(productPrice.value);
    const category = productCat.value.trim();
    const stock    = Number(productStock.value);
 
  
    if (!name) {
        showToast("Mahsulot nomini kiriting!", "error");
        return;
    }
    if (!price || price <= 0) {
        showToast("Narx 0 dan katta bo'lishi kerak!", "error");
        return;
    }
    if (!category) {
        showToast("Kategoriyani kiriting!", "error");
        return;
    }
    if (stock < 0) {
        showToast("Ombor miqdori 0 dan kichik bo'lmasin!", "error");
        return;
    }
 
   
    fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price, category, stock })
    })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                resetForm();
                loadProducts();
                showToast("Mahsulot yangilandi!", "success");
            } else {
                showToast(data.message, "error");
            }
        })
        .catch(function() {
            showToast("Xatolik yuz berdi!", "error");
        });
}
 

// 9-Topshiriq — delete: mahsulotni o'chirish

 
function deleteProduct(id) {

    const confirmed = confirm("ID: " + id + " mahsulotni o'chirmoqchimisiz?");
    if (!confirmed) return;
 

    fetch(API_URL + "/" + id, {
        method: "DELETE"
    })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                loadProducts();
                showToast("Mahsulot o'chirildi", "success");
            } else {
                showToast(data.message, "error");
            }
        })
        .catch(function() {
            showToast("Xatolik yuz berdi!", "error");
        });
}
 
 

// 10-Topshiriq saqlash tugmasi

 
saveBtn.addEventListener("click", function() {
  
    if (productId.value === "") {
        addProduct();
    } else {
      
        updateProduct(productId.value);
    }
});
 
 

// 11-Topshiriq  bekor qilish tugmasi

 
cancelBtn.addEventListener("click", function() {
    resetForm();
});
 
 

// 12-Topshiriq  qidiruv

 
searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
 
   
    const filteredProducts = allProducts.filter(function(product) {
        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });
 
    renderProducts(filteredProducts);
});