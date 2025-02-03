const apiURL = "https://fakestoreapi.com/products";

// Get the product ID from the query parameter
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

async function loadNavbar() {
    const response = await fetch('navbar.html');
    const navbarHTML = await response.text();
    document.getElementById('navbar-container').innerHTML = navbarHTML;
  }

  loadNavbar();
// Fetch product details and populate the page
async function fetchProductDetails() {
  if (!productId) {
    alert("No product ID provided!");
    return;
  }

  try {
    const response = await fetch(`${apiURL}/${productId}`);
    const product = await response.json();

    // Populate product details
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").textContent = product.title;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("product-rating").textContent = `⭐⭐⭐⭐⭐ (${product.rating.count} reviews)`;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-category").textContent = product.category;

    // Populate thumbnails (simulated using the same image)
    const thumbnailsContainer = document.getElementById("thumbnails");
    for (let i = 0; i < 5; i++) {
      const thumbnail = document.createElement("img");
      thumbnail.src = product.image;
      thumbnail.alt = `Thumbnail ${i + 1}`;
      thumbnail.classList.add("thumbnail");

      // Add event listener to update main image when thumbnail is clicked
      thumbnail.addEventListener("click", () => {
        document.getElementById("product-image").src = thumbnail.src;
      });

      thumbnailsContainer.appendChild(thumbnail);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function changeQuantity(change){
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value)
    if(currentValue + change >= 1){
        quantityInput.value = currentValue + change
    }
  }
// Load product details on page load
fetchProductDetails();
