const addProductBtn = document.getElementById("add-product");
const closeBtn = document.querySelector(".close");
const modalForm = document.querySelector(".modal-form");
let products = JSON.parse(localStorage.getItem("products")) || [];
const productTableBody = document.querySelector("#productTableBody");

// Function to handle search
document
  .querySelector(".btn-search")
  .addEventListener("click", function (event) {
    const searchQuery = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const rows = document.querySelectorAll("#productTableBody tr");

    rows.forEach((row) => {
      const productName = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      const productDescription = row
        .querySelector("td:nth-child(3)")
        .textContent.toLowerCase();
      const productPrice = row
        .querySelector("td:nth-child(4)")
        .textContent.toLowerCase();

      if (
        productName.includes(searchQuery) ||
        productDescription.includes(searchQuery) ||
        productPrice.includes(searchQuery)
      ) {
        row.style.display = "table-row"; // Display the row if it matches the search query
      } else {
        row.style.display = "none"; // Hide the row if it doesn't match the search query
      }
    });
  });

// Function to render products
function renderProducts() {
  productTableBody.innerHTML = "";
  products.forEach((product) => {
    const row = `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td><img src="${product.image}" class="product-image" alt="${product.name}" width="50"></td>
            <td><button class="editBtn" data-id="${product.id}">Edit</button></td>
            <td><button class="deleteBtn" data-id="${product.id}">Delete</button></td>
          </tr>
        `;
    productTableBody.innerHTML += row;
  });
}

//Function to add a product
addProductBtn.onclick = function addProduct(event) {
  event.preventDefault();
  const productName = document.getElementById("name").value;
  const productPrice = document.getElementById("price").value;
  const productDescription = document.getElementById("desc").value;
  const productImage = document.getElementById("image");

  if (productImage.files.length > 0) {
    const productImageFile = productImage.files[0];
    const reader = new FileReader();

    // Read the file as data URL
    reader.readAsDataURL(productImageFile);

    // When the file is loaded
    reader.onload = function () {
      const productImage = reader.result;

      const newProduct = {
        id: products.length + 1,
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        image: productImage,
      };

      console.log("product", newProduct);
      products.push(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      modalForm.reset("");
      closeBtn.click();
    };
  }
};

let modal = document.getElementById("myModal");
function openPopUp() {
  modal.classList.add("open-modal");
}
function closePopup() {
  modal.classList.remove("open-modal");
}

function deleteAll() {
  localStorage.removeItem("products");
  products = [];
  renderProducts();
}

renderProducts();

// edit and delete functionalities.
productTableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("editBtn")) {
    // Edit action
    const button = event.target;
    const productId = parseInt(button.getAttribute("data-id"));
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      const product = products[productIndex];

      // Prefill form fields with product data
      document.getElementById("name").value = product.name;
      document.getElementById("desc").value = product.description;
      document.getElementById("price").value = product.price;

      // Change submit button text to Update
      document.getElementById("add-product").textContent = "Update";

      // Display the modal
      openPopUp();

      // Handle form submission for updating the product
      document.getElementById("add-product").onclick = function (event) {
        event.preventDefault();
        const newName = document.getElementById("name").value;
        const newDescription = document.getElementById("desc").value;
        const newPrice = parseFloat(document.getElementById("price").value);

        if (newName && newDescription && !isNaN(newPrice)) {
          products[productIndex] = {
            ...product,
            name: newName,
            description: newDescription,
            price: newPrice,
            image:
              document.getElementById("image").getAttribute("data-image") ||
              product.image,
          };

          // Update localStorage with the modified product list
          localStorage.setItem("products", JSON.stringify(products));

          // Re-render the products list
          renderProducts();

          // Reset form fields
          modalForm.reset("");

          // Close the modal
          closePopup();
        } else {
          alert("Please fill all fields with valid values.");
        }
      };
    } else {
      alert("Product not found.");
    }
  } else if (event.target.classList.contains("deleteBtn")) {
    // Delete action
    const button = event.target;
    const productId = parseInt(button.getAttribute("data-id"));
    console.log(productId);
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      products.splice(productIndex, 1);

      // Update the IDs of the remaining products
      for (let i = productIndex; i < products.length; i++) {
        products[i].id = i + 1;
      }

      // Update localStorage with the modified product list
      localStorage.setItem("products", JSON.stringify(products));

      // Re-render the products list
      renderProducts();
    } else {
      alert("Product not found.");
    }
  }
});

// Function to handle sorting by ID
document.getElementById("sortById").addEventListener("click", function (event) {
  const isAscending = this.classList.contains("asc"); // Check if currently in ascending order

  // Toggle between ascending and descending order
  if (isAscending) {
    this.classList.remove("asc");
    this.innerHTML = "&#x25BC;"; // Downward triangle for descending order
  } else {
    this.classList.add("asc");
    this.innerHTML = "&#x25B2;"; // Upward triangle for ascending order
  }

  // Comparator function for sorting by ID
  const idComparator = (a, b) => {
    return isAscending ? a.id - b.id : b.id - a.id;
  };

  // Sort the products array based on the ID using the comparator function
  products.sort(idComparator);

  // Re-render the products list with sorted products
  renderProducts();
});

// Function to handle sorting by name
document
  .getElementById("sortByName")
  .addEventListener("click", function (event) {
    const isAscending = this.classList.contains("asc"); // Check if currently in ascending order

    // Toggle between ascending and descending order
    if (isAscending) {
      this.classList.remove("asc");
      this.innerHTML = "&#x25BC;"; // Downward triangle for descending order
    } else {
      this.classList.add("asc");
      this.innerHTML = "&#x25B2;"; // Upward triangle for ascending order
    }

    // Comparator function for sorting by name
    const nameComparator = (a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return isAscending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    };

    // Sort the products array based on the name using the comparator function
    products.sort(nameComparator);

    // Re-render the products list with sorted products
    renderProducts();
  });

// Function to handle sorting by price
document
  .getElementById("sortByPrice")
  .addEventListener("click", function (event) {
    const isAscending = this.classList.contains("asc"); // Check if currently in ascending order

    // Toggle between ascending and descending order
    if (isAscending) {
      this.classList.remove("asc");
      this.innerHTML = "&#x25BC;"; // Downward triangle for descending order
    } else {
      this.classList.add("asc");
      this.innerHTML = "&#x25B2;"; // Upward triangle for ascending order
    }

    // Comparator function for sorting by price
    const priceComparator = (a, b) => {
      return isAscending ? a.price - b.price : b.price - a.price;
    };

    // Sort the products array based on the price using the comparator function
    products.sort(priceComparator);

    // Re-render the products list with sorted products
    renderProducts();
  });
