// import "./style.css";

//State

let state = {
  products: [],
  userLoged: true,
  mainCategories: {
    Clothes: [],
    Smartphones: [],
  },
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

function render() {
  prodSec.innerHTML = "";
  if (!header.childNodes.length) createHeader();
  for (let product of state.products) {
    if (filterProducts(product)) {
      prodSec.appendChild(createProduct(product));
    }
  }
  state.searchInput = "";
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

//The function to create the footer

function createFooter() {
  //   
  //   <div class="back_to_top">
  //     <button class="to_top_button">
  //     <span class="material-symbols-outlined"> expand_less </span>
  //     <p>Back to top</p>
  //   </button>
  //   </div>
  //   <div class="footer_a">
  //     <a href="about_footer_a">About us</a>
  //     <a href="partners_footer_a">Partners</a>
  //     <a href="faq_footer_a">FAQ</a>
  //     <a href="mm_footer_a">Make money with us</a>
  //     <a href="policies_footer_a">Policies</a>
  //   </div>
  //
  let divEl = document.createElement("div");
  divEl.className = "back_to_top";
  let buttonEl = document.createElement("button");
  buttonEl.className = "to_top_button";
  footer.append();
  buttonEl.addEventListener("click", ()  => {
    window.scrollTo(0, 0); // scroll to top of page
  } 
  );
  let spanEl = document.createElement("span");
  spanEl.className = "material-symbols-outlined";
  spanEl.textContent = "expand_less";
  let pEl = document.createElement("p");
  pEl.textContent = "Back to top";
  buttonEl.append(spanEl, pEl);
  divEl.append(buttonEl);
  

  let footerA = document.createElement("div");
  footerA.className = "footer_a";
  let footerA1 = document.createElement("a");
  footerA1.href = "about_footer_a";
  footerA1.textContent = "About us";
  let footerA2 = document.createElement("a");
  footerA2.href = "partners_footer_a";
  footerA2.textContent = "Partners";
  let footerA3 = document.createElement("a");
  footerA3.href = "faq_footer_a";
  footerA3.textContent = "FAQ";
  let footerA4 = document.createElement("a");
  footerA4.href = "mm_footer_a";
  footerA4.textContent = "Make money with us";
  let footerA5 = document.createElement("a");
  footerA5.href = "policies_footer_a";
  footerA5.textContent = "Policies";
  footerA.append(footerA1, footerA2, footerA3, footerA4, footerA5);
  footer.append(divEl, footerA);

}





//Function to get the products from DB

function getProducts() {
  fetch("http://localhost:3006/products")
    .then((resp) => resp.json())
    .then((products) => {
      state.products = products;
      render();
    });
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
