const apiURL = "https://fakestoreapi.com/products";
let products = [];

// Fetch data from API
async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function loadNavbar() {
    const response = await fetch('navbar.html');
    const navbarHTML = await response.text();
    document.getElementById('navbar-container').innerHTML = navbarHTML;
  }

  loadNavbar();



function renderProducts(products) {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <p> <i class="bi bi-heart"> </i> </p>
      </div>
    `).join('');
  
    
    attachProductListeners();
  }
  

//

function attachProductListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-id');
      
        window.location.href = `product-details.html?id=${productId}`;
      });
    });
  }
  


document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const selectedCategories = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    const filteredProducts = products.filter(product => selectedCategories.includes(product.category));
    renderProducts(selectedCategories.length ? filteredProducts : products);
  });
});


document.getElementById("sort").addEventListener("change", (event) => {
    const sortValue = event.target.value;
    let sortedProducts = [];
  
    if (sortValue === "lowToHigh") {
      sortedProducts = [...products].sort((a, b) => a.price - b.price);
    } else if (sortValue === "highToLow") {
      sortedProducts = [...products].sort((a, b) => b.price - a.price);
    } else {
      sortedProducts = [...products]; 
    }
  
    renderProducts(sortedProducts);
  });
 

fetchProducts();
