// import "./style.css";

//State

let state = {
  products: [],
  user: false,
  selectedCategory: "",
  mainCategories: [],
  selectedCategories: [],
  searchInput: "",
  sortByPrice: [],
  sortBySeller: "",
  modal: "",
  users: [],
  page: "",
};

//Variables for the different parts of the page

let header = document.querySelector(".header");
let filterAside = document.querySelector(".filters-section");
let prodSec = document.querySelector(".products-section");
let footer = document.querySelector("footer");
let modal = document.querySelector("#modal");
let prodOrProfilePage = document.querySelector("#profile-or-product-page");

//Main render function
getCategories();
function render() {
  prodSec.innerHTML = "";
  header.innerHTML = "";
  if (!header.childNodes.length) createHeader();

  for (let product of state.products) {
    if (filterProducts(product)) {
      prodSec.appendChild(createProduct(product));
    }
  }

  if (filterAside.childNodes.length === 5) renderCategories();
}
// Get the products from database and call render();

getProducts();
getTheUsers();
//The function to create the header

function createHeader() {
  //Logo
  if (header === null) return;

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
  //
  if (!state.user) {
    let headerRightSide = document.createElement("div");
    headerRightSide.className = "header__right-side-no-user";
    headerRightSide.addEventListener("click", () => {
      state.modal = "login-or-signup";
      renderModal();
    });
    let pEl1 = document.createElement("p");
    pEl1.className = "dif";
    pEl1.textContent = "Sign in";
    let pEl2 = document.createElement("p");
    pEl2.className = "dif";
    pEl2.textContent = "/ Sign up";

    headerRightSide.append(pEl1, pEl2);
    headerRightSideContainer.appendChild(headerRightSide);
  } else {
    headerRightSideContainer.innerHTML = "";
    let shoppingCart = document.createElement("span");
    shoppingCart.className = "material-symbols-outlined cart";
    shoppingCart.textContent = "shopping_cart";
    shoppingCart.addEventListener("click", function () {
      state.modal = "cart";
      renderModal();
    });
    let profileAvatar = document.createElement("img");
    profileAvatar.src = state.user.userimage;
    profileAvatar.className = "profile-avatar";
    profileAvatar.addEventListener("click", function () {
      header.style = "display: none;";
      document.querySelector(".main-container").style = "display: none;";
      modal.style = "display: none;";
      state.page = "profile-page";
    });
    if (state.user.onCart.length) {
      let onCartNumber = document.createElement("div");
      onCartNumber.textContent = state.user.onCart.length;
      onCartNumber.className = "on-cart-number";
      shoppingCart.appendChild(onCartNumber);
    }

    headerRightSideContainer.append(shoppingCart, profileAvatar);
    // header.append(headerRightSideContainer);
    // return;
  }
  return headerRightSideContainer;
}

function renderPage() {
  let page = document.querySelector("#profile-or-product-page");
  page.className = "profile-or-product-page";
  if (state.page === "product-page") {
    header.style = "display: none;";
    document.querySelector(".main-container").style = "display: none;";
    modal.style = "display: none;";
    state.page = "profile-page";
  }
}

//The function to create the footer

function createFooter() {
  if (footer === null) return;

  let divEl = document.createElement("div");
  divEl.className = "back_to_top";
  let buttonEl = document.createElement("button");
  buttonEl.className = "to_top_button";
  footer.append();
  buttonEl.addEventListener("click", () => {
    window.scrollTo(0, 0); // scroll to top of page
  });
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

createFooter();

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
    refreshFilter(divEl);
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
      state.selectedCategory = categoryTitle.textContent.toLocaleLowerCase();
      h2El.textContent = catTitle;
      ulEl.textContent = "";
      console.log(state.searchInput);
      render();
      getSubCategories(j, ulEl, divEl);
    });
    ulEl.appendChild(categoryTitle);
  }

  divEl.appendChild(ulEl);
  filterAside.prepend(divEl);
}

//Function to create single product

function createProduct(product) {
  let prodDiv = document.createElement("div");
  prodDiv.className = "product";
  prodDiv.addEventListener("click", function () {
    state.page = "product-page";
    renderPage(product);
  });
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

function filterProductss(product) {
  if (state.selectedCategory !== "" && state.selectedCategories.length === 0) {
  }
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
function filterProducts(product) {
  if (state.searchInput) {
    if (!product.name.toLocaleLowerCase().includes(state.searchInput))
      return false;
  }
  if (state.selectedCategory && state.selectedCategories.length === 0) {
    if (!product.categories.includes(state.selectedCategory)) return false;
  }
  if (state.selectedCategories.length !== 0) {
    let a = false;
    for (let cat of state.selectedCategories) {
      console.log(cat);
      if (product.categories.includes(cat)) a = true;
    }
    console.log(a);
    if (a === false) return false;
  }
  // if (state.sortByPrice[0]) {
  //   console.log(state.sortByPrice[0]);
  // }
  if (state.sortByPrice.length !== 0) {
    if (
      !(
        product.price >= state.sortByPrice[0] &&
        product.price <= state.sortByPrice[1]
      )
    ) {
      return false;
    }
  }
  if (state.sortBySeller) {
    if (!(product.seller === state.sortBySeller)) return false;
  }
  return product;
}

//Function to get the input from search-bar

function getSearchInput(inputValue) {
  state.searchInput = inputValue;
  render();
}
//Function to refresh all the filters
function refreshFilter(divEl) {
  document.querySelector(".from").value = "";
  document.querySelector(".to").value = "";
  document.querySelector(".sort-by-seller-input").value = "";
  state.selectedCategory = "";
  state.selectedCategories = [];
  divEl.textContent = "";
  state.searchInput = "";
  state.sortByPrice = [];
  state.sortBySeller = "";
  document.querySelector(".search-form").reset();
}
//Function to render modals
// {
//           "id": 3,
//           "categories": ["clothes", "men", "jeans"],
//           "name": "DARK WASH BOOT JEANS",
//           "image": "https://img.hollisterco.com/is/image/anf/KIC_331-7300-1302-276_prod1?policy=product-large",
//           "price": 49.99,
//           "shipping": 4,
//           "dateEntered": "2021/08/10",
//           "stock": 10,
//           "sold": 4,
//           "seller": "aladin",
//           "desc": "lorem lorem lorem lorem lorem lorem lorem"
//         }
function renderModal() {
  modal.innerHTML = "";
  modal.className = "modal";
  let modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  let brandTitle = document.createElement("h1");
  brandTitle.textContent = "Hoxstore";
  let closeBtn = document.createElement("span");
  closeBtn.className = "material-symbols-outlined close";
  closeBtn.textContent = "close";
  closeBtn.addEventListener("click", function () {
    modal.className = "";
    modal.innerHTML = "";
    modalContent.remove();
    state.modal = "";
  });
  if (state.modal === "login-or-signup") {
    let h3El = document.createElement("h3");
    h3El.textContent = "Log in";
    let loginForm = document.createElement("form");
    loginForm.className = "log-in-form";

    let h4El = document.createElement("h4");
    h4El.textContent = "Email";
    let emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.required = true;
    emailInput.placeholder = "Type your email";
    let h4El2 = document.createElement("h4");
    h4El2.textContent = "Password";
    let passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.required = true;
    passwordInput.placeholder = "Type your password";
    let loginBtn = document.createElement("input");
    loginBtn.type = "submit";
    loginBtn.value = "Log in";
    loginBtn.id = "log-in-btn";
    loginForm.append(h4El, emailInput, h4El2, passwordInput, loginBtn);
    let p1 = document.createElement("p");
    p1.textContent = "Or";
    let p2 = document.createElement("p");
    p2.id = "create-acc-link";
    p2.textContent = "Create an account if you don't have one";
    p2.addEventListener("click", function () {
      state.modal = "create-account";
      renderModal();
    });

    let p3 = document.createElement("p");
    p3.id = "log-in-error-message";
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!checkValidity(emailInput.value, passwordInput.value)) {
        emailInput.value = "";
        passwordInput.value = "";
        p3.textContent = "Incorrect account details";
      } else {
        modal.className = "";
        console.log(state.user.onCart);
        modalContent.remove();
        createRightHeaderSide();
        console.log("asdasdas");
        console.log(state.user);
        render();
      }
    });
    modalContent.append(closeBtn, brandTitle, h3El, loginForm, p1, p2, p3);
    modal.appendChild(modalContent);
  } else if (state.modal === "create-account") {
    let h1El = document.createElement("h1");
    h1El.textContent = "Hoxstore";
    let h3El = document.createElement("h3");
    h3El.textContent = "Create account";
    let createAccForm = document.createElement("form");
    createAccForm.className = "create-acc-form";
    modalContent.className = "modal-content create-acc-modal";
    closeBtn.className = `${closeBtn.className} success`;
    createAccForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        checkValidity(
          emailInput.value,
          "a",
          nameInput.value,
          passwordInput.value,
          passwordInput2.value
        )
      ) {
        console.log("ti qifsha");
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        passwordInput2.value = "";
        errorText.textContent = "Something is wrong";
      } else {
        let newAcc = {
          username: `${nameInput.value}`,
          email: `${emailInput.value}`,
          password: `${passwordInput.value}`,
          userimage: "./profile.png",
          balance: 500,
          onCart: [],
          bought: [],
        };
        fetch("http://localhost:3007/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newAcc),
        });
        modalContent.innerHTML = "";
        modalContent.innerHTML = "<h1>Account created succesfully</h1>";
        modalContent.prepend(closeBtn);
        state.users.push(newAcc);
        console.log(state.users);
      }
    });
    let h4El = document.createElement("h4");
    h4El.textContent = "What's your name?";
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.required = true;
    nameInput.placeholder = "Username";
    let h4El2 = document.createElement("h4");
    h4El2.textContent = "What's your email adress?";
    let emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.required = true;
    emailInput.placeholder = "Email";
    let h4El3 = document.createElement("h4");
    h4El3.textContent = "What's your password?";
    let passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.required = true;
    passwordInput.placeholder = "Passworda";
    let h4El4 = document.createElement("h4");
    h4El4.textContent = "Confirm your password";
    let passwordInput2 = document.createElement("input");
    passwordInput2.type = "password";
    passwordInput2.required = true;
    passwordInput2.placeholder = "Confirm passworddd";
    let divEl1 = document.createElement("div");
    divEl1.className = "accept-TOS";

    let tcCheckbox = document.createElement("p");
    // tcCheckbox.required = true
    tcCheckbox.id = "accept-text";
    tcCheckbox.textContent = "I agree with the T&Cs.";
    let tcCheckboxInput = document.createElement("input");
    tcCheckboxInput.type = "checkbox";
    tcCheckboxInput.required = true;
    tcCheckboxInput.id = "accept";
    divEl1.append(tcCheckbox, tcCheckboxInput);
    // tcCheckbox.append(tcCheckboxInput);
    let createAccBtn = document.createElement("input");
    createAccBtn.type = "submit";
    createAccBtn.value = "Create account";
    createAccBtn.id = "create-acc-btn";
    let errorText = document.createElement("p");
    errorText.id = "create-acc-error-message";
    createAccForm.append(
      h4El,
      nameInput,
      h4El2,
      emailInput,
      h4El3,
      passwordInput,
      h4El4,
      passwordInput2,
      divEl1,
      createAccBtn,
      errorText
    );
    modalContent.append(closeBtn, brandTitle, h3El, createAccForm);
    modal.append(modalContent);
  } else if (state.modal === "cart") {
    if (state.user.onCart.length === 0) {
    }
    modal.innerHTML = "";
    modalContent.innerHTML = "";
    modalContent.className = " modal-content cart-modal";
    let prodsSecDiv = document.createElement("div");
    prodsSecDiv.className = "modal-cart-product-section";
    let logoLink = document.createElement("a");
    brandTitle.className = "cart-modal-title";
    logoLink.appendChild(brandTitle);
    closeBtn.className = "material-symbols-outlined close-cart-modal";
    let bagCount = document.createElement("h4");
    bagCount.textContent = `Bag (${state.user.onCart.length})`;
    let prodSecDiv = document.createElement("div");
    prodSecDiv.className = "cart-prod-section";
    let total = 0;
    let shippingTotalPrice = 0;
    let index = 0;
    for (let i = 0; i < state.user.onCart.length; i++) {
      let product = state.user.onCart[i];
      total += product.price;
      shippingTotalPrice += product.shipping;
      let prod = document.createElement("div");
      prod.className = "cart-prod";
      let prodImg = document.createElement("img");
      prodImg.className = "cart-prod-image";
      prodImg.src = product.image;
      let cartProdInfos = document.createElement("div");
      cartProdInfos.className = "cart-prod-infos";
      let prodInfo = document.createElement("div");
      prodInfo.className = "cart-prod-infos";
      let namePrice = document.createElement("div");
      namePrice.className = "name-price";
      let prodNameUnit = document.createElement("span");
      prodNameUnit.className = "name-price";
      let prodName = document.createElement("strong");
      prodName.textContent = product.name;
      prodNameUnit.appendChild(prodName);
      let prodPriceUnit = document.createElement("span");
      prodPriceUnit.className = "name-price";
      let prodPrice = document.createElement("span");
      prodPrice.className = "cart-prod-price";
      prodPrice.textContent = `$${product.price.toFixed(2)}`;
      prodPriceUnit.appendChild(prodPrice);
      namePrice.append(prodNameUnit, prodPriceUnit);
      let poDiv = document.createElement("div");
      poDiv.className = "po";
      let prodDesc = document.createElement("span");
      prodDesc.className = "cart-prod-info";
      prodDesc.textContent = product.desc;
      poDiv.appendChild(prodDesc);
      let poDiv2 = document.createElement("div");
      poDiv2.className = "po";
      let prodShip = document.createElement("span");
      prodShip.className = "cart-prod-info";
      prodShip.textContent = `Shipping:  $${product.shipping.toFixed(2)}`;
      poDiv2.appendChild(prodShip);
      let poDiv3 = document.createElement("div");
      poDiv3.className = "po";
      let removeBtn = document.createElement("button");
      removeBtn.className = "cart-prod-info cart-prod-remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", function () {
        state.user.onCart[i] = "";
        let a = state.user.onCart.filter((productt) => productt !== "");
        state.user.onCart = a;
        console.log(state.user.onCart);
        prod.remove();
        renderModal();
        document.querySelector(".on-cart-number").textContent =
          state.user.onCart.length;
        fetch(`http://localhost:3007/users/${state.user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: `${JSON.stringify(state.user)}`,
        });
      });
      poDiv3.appendChild(removeBtn);
      let div = document.createElement("div");
      prodInfo.append(namePrice, poDiv, poDiv2, poDiv3, div);
      prod.append(prodImg, prodInfo);
      prodSecDiv.appendChild(prod);
      index++;
    }
    prodsSecDiv.append(logoLink, bagCount, prodSecDiv);
    console.log(total);
    console.log(shippingTotalPrice);
    // info abt bag
    let infoAbtBag = document.createElement("div");
    infoAbtBag.className = "info-about-bag";
    let summary = document.createElement("h3");
    summary.className = "summary";
    summary.textContent = "Summary";
    let divEl1 = document.createElement("div");
    divEl1.className = "h";
    let divSub = document.createElement("div");
    divSub.className = "cart-modal-summary-info sub";
    let subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal";
    let subtotalNumber = document.createElement("p");
    subtotalNumber.textContent = `$${total.toFixed(2)}`;
    divSub.append(subtotal, subtotalNumber);
    let shippingUnit = document.createElement("div");
    shippingUnit.className = "cart-modal-summary-info";
    let shipping = document.createElement("p");
    shipping.textContent = "Estimated shipping and handling";
    let shippingPrice = document.createElement("p");
    shippingPrice.textContent = `$${shippingTotalPrice.toFixed(2)}`;
    shippingUnit.append(shipping, shippingPrice);
    divEl1.append(divSub, shippingUnit);
    let totalUnit = document.createElement("div");
    totalUnit.className = "cart-modal-summary-info total";
    let totalTitle = document.createElement("h4");
    totalTitle.textContent = "Total";
    let totalPriceUnit = document.createElement("p");
    let totalPrice = document.createElement("strong");
    totalPrice.textContent = `$${(total + shippingTotalPrice).toFixed(2)}`;
    totalPriceUnit.appendChild(totalPrice);
    totalUnit.append(totalTitle, totalPriceUnit);
    let checkoutBtnUnit = document.createElement("div");
    let checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.textContent = "Checkout";
    checkoutBtnUnit.appendChild(checkoutBtn);
    infoAbtBag.append(summary, divEl1, totalUnit, checkoutBtnUnit);
    if (state.user.onCart.length === 0) {
      prodSecDiv.textContent = "No products on your bag";
      prodSecDiv.className = "no-products-on-bag";
      closeBtn.className = "material-symbols-outlined no-products";
    }

    modalContent.append(closeBtn, prodsSecDiv, infoAbtBag);
    modal.appendChild(modalContent);
  }
}
//Function to check for validity
function checkValidity(emailt, passwordt, username, password1, password2) {
  if (state.modal === "login-or-signup") {
    for (let user of state.users) {
      if (user.email === emailt && user.password === passwordt) {
        state.user = user;
        return true;
      }
    }
  } else if (state.modal === "create-account") {
    for (let user of state.users) {
      console.log(user.email, emailt);
      console.log(user.username, username);
      console.log(password1, password2);
      if (user.email === emailt) {
        return true;
      }
      if (user.username === username) {
        return true;
      }
      if (password1 !== password2) {
        return true;
      }
      // if (
      //   user.email === emailt ||
      //   user.username === username ||
      //   password1 !== password2
      // ) {
      //   return false;
      // }
    }
    return false;
  }
}
//Adding eventlisteners to sort by price and by seller forms
document.querySelector(".sort-price").addEventListener("submit", (e) => {
  e.preventDefault();
  let from = Number(document.querySelector(".from").value);
  let to = Number(document.querySelector(".to").value);
  if (from > to || (from === 0 && to === 0) || (from < 0 && to < 0)) {
    state.sortByPrice = [];
    render();
    return;
  }
  if (from < 0) {
    state.sortByPrice[0] = 0;
    state.sortByPrice[1] = to;
  }
  state.sortByPrice[0] = from;
  state.sortByPrice[1] = to;
  render();
});
document.querySelector(".sort-seller").addEventListener("submit", (e) => {
  e.preventDefault();
  let seller = document.querySelector(".sort-by-seller-input").value;
  state.sortBySeller = seller;
  render();
});

function getTheUsers() {
  fetch("http://localhost:3007/users")
    .then((resp) => resp.json())
    .then((users) => {
      state.users = users;
      console.log(state.users);
    });
}

//Function to add a product to the cart
function addToCart(product) {
  state.user.onCart.push(product);
  fetch(`http://localhost:3007/users/${state.user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: `${JSON.stringify(state.user)}`,
  });
}
//Function to buy a product
function buyProduct(product) {
  state.user.bought.push(product);
  state.user.balance -= product.price;
  fetch(`http://localhost:3007/users/${state.user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: `${JSON.stringify(state.user)}`,
  });
}

//Function to goBack
function goBack() {}
