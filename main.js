// import "./style.css";

//State

let state = {
  products: [],
  userLoged: false,
  selectedCategory: "",
  mainCategories: [],
  selectedCategories: [],
  searchInput: "",
};

//Variables for the different parts of the page

let header = document.querySelector(".header");
let filterAside = document.querySelector(".filters-section");
let prodSec = document.querySelector(".products-section");
let footer = document.querySelector("footer");
let modal = document.querySelector(".modal");

//Main render function
getCategories();
function render() {
  prodSec.innerHTML = "";
  if (!header.childNodes.length) createHeader();
  for (let product of state.products) {
    if (filterProducts(product)) {
      prodSec.appendChild(createProduct(product));
    }
  }
  state.searchInput = "";

  if (filterAside.childNodes.length === 5) renderCategories();
}
// Get the products from database and call render();

getProducts();

//The function to create the header

function createHeader() {
  //Logo
  let logoLink = document.createElement("a");
  logoLink.href = "./index.html";
  logoLink.className = "header__logo";
  logoLink.textContent = "HOXSTORE";

  //Search-bar
  let headerSearchDiv = document.createElement("div");
  headerSearchDiv.className = "header__search";
  let searchForm = document.createElement("form");
  searchForm.className = "search-form";
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getSearchInput(searchInput.value);
  });
  let searchInput = document.createElement("input");
  searchInput.className = "search-input";
  searchInput.placeholder = "Search products";
  let searchIcon = document.createElement("span");
  searchIcon.className = "material-symbols-outlined search-icon";
  searchIcon.textContent = "search";

  searchForm.append(searchInput, searchIcon);
  headerSearchDiv.appendChild(searchForm);

  //Call this function to create right header side
  header.append(logoLink, headerSearchDiv, createRightHeaderSide());
}

//Function that render things on the right side of
// header depending if there is a user logged in

function createRightHeaderSide() {
  let headerRightSideContainer = document.createElement("div");
  headerRightSideContainer.className = "header__right-side-items";

  if (!state.userLoged) {
    let headerRightSide = document.createElement("div");
    headerRightSide.className = "header__right-side-no-user";
    let pEl1 = document.createElement("p");
    pEl1.className = "dif";
    pEl1.textContent = "Sign in";
    let pEl2 = document.createElement("p");
    pEl2.className = "dif";
    pEl2.textContent = "/ Sign up";

    headerRightSide.append(pEl1, pEl2);
    headerRightSideContainer.appendChild(headerRightSide);
  } else {
    let shoppingCart = document.createElement("span");
    shoppingCart.className = "material-symbols-outlined";
    shoppingCart.textContent = "shopping_cart";
    let profileAvatar = document.createElement("img");
    profileAvatar.src =
      "https://m.media-amazon.com/images/I/71PGvPXpk5L._SL1500_.jpg";
    profileAvatar.className = "profile-avatar";
    headerRightSideContainer.append(shoppingCart, profileAvatar);
  }
  return headerRightSideContainer;
}

//Function to get the products from DB

function getProducts() {
  fetch("http://localhost:3006/products")
    .then((resp) => resp.json())
    .then((products) => {
      state.products = products;
      // getCategories();
      render();
    });
}
//Function to get the categories

function getCategories() {
  fetch("http://localhost:3006/categories")
    .then((resp) => resp.json())
    .then((categories) => {
      state.mainCategories = categories;
    });
}
//Function to render the categories filter
function getSubCategories(index, ulEl, divEl) {
  state.selectedCategories = [];
  for (let i = 0; i < state.mainCategories[index].length - 1; i++) {
    let categoryTitle = document.createElement("li");
    categoryTitle.textContent = state.mainCategories[index][i];
    categoryTitle.addEventListener("click", function () {
      if (
        state.selectedCategories.includes(
          categoryTitle.textContent.toLocaleLowerCase()
        )
      ) {
        for (let j = 0; j < state.selectedCategories.length; j++) {
          if (
            state.selectedCategories[j] ===
            categoryTitle.textContent.toLocaleLowerCase()
          ) {
            let a =
              state.selectedCategories[state.selectedCategories.length - 1];
            state.selectedCategories[state.selectedCategories.length - 1] =
              state.selectedCategories[j];
            state.selectedCategories[j] = a;
            state.selectedCategories.pop();
            break;
          }
        }

        categoryTitle.className = "";
      } else {
        state.selectedCategories.push(
          categoryTitle.textContent.toLocaleLowerCase()
        );
        categoryTitle.className = "selected-category";
      }
      console.log(state.selectedCategories);
      render();
    });

    ulEl.appendChild(categoryTitle);
  }
  let goBack = document.createElement("h4");
  goBack.textContent = "Remove filters";
  goBack.addEventListener("click", function () {
    state.selectedCategory = "";
    state.selectedCategories = [];
    divEl.textContent = "";
    state.searchInput = "";
    document.querySelector(".search-form").reset();
    goBack.remove();
    renderCategories();
    render();
  });
  filterAside.appendChild(goBack);
}
function renderCategories() {
  let divEl = document.createElement("div");
  divEl.className = "categories-wrapper";
  let h2El = document.createElement("h2");
  h2El.textContent = "Shop by Category";
  let ulEl = document.createElement("ul");
  divEl.appendChild(h2El);
  for (let j = 0; j < state.mainCategories.length; j++) {
    let bigCat = state.mainCategories[j].length - 1;
    let catTitle = state.mainCategories[j][bigCat];
    let categoryTitle = document.createElement("li");
    categoryTitle.textContent = catTitle;
    categoryTitle.addEventListener("click", () => {
      state.selectedCategories = [];
      state.selectedCategories.push(
        categoryTitle.textContent.toLocaleLowerCase()
      );
      state.selectedCategory = categoryTitle.textContent.toLocaleLowerCase();
      h2El.textContent = catTitle;
      ulEl.textContent = "";

      render();
      getSubCategories(j, ulEl, divEl);
    });
    ulEl.appendChild(categoryTitle);
    // for (let i = 0; i < state.mainCategories[j].length - 1; i++) {
    //   let clicked = false;
    //   let category = document.createElement("li");
    //   category.textContent = state.mainCategories[j][i];
    //   category.addEventListener("click", () => {
    //     if (state.selectedCategory !== "") {
    //       if (state.selectedCategory !== catTitle) {
    //         state.selectedCategory = catTitle;
    //         state.selectedCategories = [];
    //         state.selectedCategories.push(category);
    //         document.querySelectorAll(".selected-category").className = "";
    //         category.className = "selected-category";
    //         clicked = !clicked;
    //       } else {
    //         if (!clicked) {
    //           state.selectedCategories.push(e.target.value);
    //           category.className = "selected-category";
    //           clicked = !clicked;
    //         } else {
    //           category.className = "";
    //           state.selectedCategories[i] = "";
    //         }
    //       }
    //     }
    //   });
    //   ulEl.appendChild(category);
    // }
  }

  divEl.appendChild(ulEl);
  filterAside.prepend(divEl);
}

//Function to create single product

function createProduct(product) {
  let prodDiv = document.createElement("div");
  prodDiv.className = "product";
  let prodImgWrapper = document.createElement("div");
  prodImgWrapper.className = "product-image-wrapper";
  let prodImg = document.createElement("img");
  prodImg.src = product.image;
  prodImg.className = "product-image";
  let prodName = document.createElement("h4");
  prodName.className = "product-name";
  prodName.textContent = product.name;
  let stockDiv = document.createElement("div");
  stockDiv.className = "stock";
  let p1 = document.createElement("p");
  p1.className = "on-stock";
  p1.textContent = "On stock:";
  let p2 = document.createElement("p");
  p2.className =
    product.stock > 3 ? "on-stock-number-green" : "on-stock-number-red";
  p2.textContent = product.stock;
  let prodPrice = document.createElement("p");
  prodPrice.className = "product-price";
  prodPrice.textContent = `$${product.price}`;
  let prodSold = document.createElement("p");
  prodSold.className = "sold";
  prodSold.textContent = `${product.sold} sold`;

  stockDiv.append(p1, p2);
  prodImgWrapper.appendChild(prodImg);
  prodDiv.append(prodImgWrapper, prodName, stockDiv, prodPrice, prodSold);

  return prodDiv;
}

//Filter function that determines whether a product should be displayed

function filterProducts(product) {
  if (state.searchInput === "" && state.selectedCategories.length === 0)
    return product;
  if (state.searchInput !== "" && state.selectedCategories.length !== 0) {
    if (product.name.toLowerCase().includes(state.searchInput)) {
      for (let category of product.categories) {
        if (product.categories.includes(category)) {
          return product;
        }
      }
    }
  } else if (state.searchInput !== "") {
    if (product.name.toLowerCase().includes(state.searchInput)) {
      return product;
    }
  } else if (state.selectedCategories.length !== 0) {
    for (let category of state.selectedCategories) {
      if (product.categories.includes(category)) {
        return product;
      }
    }
  }
  return null;
}

//Function to get the input from search-bar

function getSearchInput(inputValue) {
  state.searchInput = inputValue;
  render();
}
