const apiURL = "https://fakestoreapi.com/products";
let products = [];
let displayedProducts = [];
let batchSize = 10; 

// Fetch data from API
async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    products = await response.json();
    console.log("Fetched products:", products);

    displayedProducts = products.slice(0, batchSize);
    renderProducts(displayedProducts);
    setupLoadMoreButton();
    attachSearchListener();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function loadNavbar() {
  try {
    const response = await fetch("navbar.html");
    const navbarHTML = await response.text();
    document.getElementById("navbar-container").innerHTML = navbarHTML;
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

loadNavbar();

// Render products in the grid
function renderProducts(productsToRender) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) {
    console.error("Element with ID 'product-grid' not found.");
    return;
  }

  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <p> <i class="bi bi-heart"> </i> </p>
      </div>
    `
    )
    .join("");

  updateLoadMoreButton();
}


function setupLoadMoreButton() {
  const loadMoreContainer = document.getElementById("load-more-container");
  if (!loadMoreContainer) {
    console.error("Load More button container not found.");
    return;
  }

  loadMoreContainer.innerHTML = `<button id="load-more" class="load-more-btn">Load More</button>`;

  document.getElementById("load-more").addEventListener("click", loadMoreProducts);
}


function loadMoreProducts() {
  const nextBatch = products.slice(displayedProducts.length, displayedProducts.length + batchSize);

  if (nextBatch.length > 0) {
    displayedProducts = [...displayedProducts, ...nextBatch];
    renderProducts(displayedProducts);
  }

  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  const loadMoreButton = document.getElementById("load-more");
  if (loadMoreButton) {
    loadMoreButton.style.display = displayedProducts.length < products.length ? "block" : "none";
  }
}


function attachSearchListener() {
  const searchInput = document.getElementById("search-bar");
  const productGrid = document.getElementById("product-grid");

  if (!searchInput || !productGrid) {
    console.error("Search bar or product grid not found.");
    return;
  }

  searchInput.addEventListener("input", () => {
    const searchItem = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(searchItem)
    );

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <p style="color:red; text-align: center; font-size: 18px; margin-top: 20px;">
          No products found.
        </p>`;
    } else {
      renderProducts(filteredProducts);
    }

   
    document.getElementById("load-more-container").style.display = searchItem ? "none" : "block";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedCategories = Array.from(
        document.querySelectorAll('.filters input[type="checkbox"]:checked')
      ).map((checkbox) => checkbox.value);

      const filteredProducts = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
      renderProducts(selectedCategories.length ? filteredProducts : displayedProducts);
    });
  });


  const sortDropdown = document.getElementById("sort");
  if (sortDropdown) {
    sortDropdown.addEventListener("change", (event) => {
      const sortValue = event.target.value;
      let sortedProducts = [...displayedProducts];

      if (sortValue === "lowToHigh") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortValue === "highToLow") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }

      renderProducts(sortedProducts);
    });
  }
});


fetchProducts();
