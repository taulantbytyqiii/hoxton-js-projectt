// import "./style.css";

//State

let state = {
  products: [],
  userLoged: false,
};

//Variables for the different parts of the page

let header = document.querySelector(".header");
let filterAside = document.querySelector("aside");
let prodSec = document.querySelector("section");
let footer = document.querySelector("footer");

//Main render function

function render() {
  if (!header.childNodes.length) createHeader();
}
render();

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
