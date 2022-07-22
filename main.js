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
      document.querySelector("#profile-pag").id = "profile-page";
      state.page = "profile-page";
      renderPage();
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

function renderPage(product) {
  let page = document.querySelector("#profile-or-product-page");
  page.className = "profile-or-product-page";
  if (state.page === "product-page") {
    header.style = "display: none;";
    document.querySelector(".main-container").style = "display: none;";
    modal.style = "display: none;";
    state.page = "profile-page";
    page.style = "display: grid;";

    let h1El = document.createElement("h1");
    h1El.className = "hoxstore-title";

    h1El.innerHTML = `<div class="goback">
          <span class="material-symbols-outlined go-back"> arrow_back </span>
        </div>
        Hoxstore`;
    // h1El.textContent = "Hoxstore";
    page.appendChild(h1El);
    let goBack = document.querySelector(".goback");
    goBack.addEventListener("click", () => {
      page.className = "";
      page.innerHTML = "";
      header.style = "display: grid;";
      document.querySelector(".main-container").style = "display: auto;";
      modal.style = "display: grid;";
      state.page = "";
      render();
    });

    let productPageContent = document.createElement("div");
    productPageContent.className = "product-page-content";
    let productOtherImages = document.createElement("div");

    productOtherImages.className = "product-other-images";

    // let productOtherImageContainer = document.createElement("div");
    // productOtherImageContainer.className = "product-other-image-container";
    // let productOtherImage = document.createElement("img");
    // productOtherImage.className = "product-other-image";
    // productOtherImage.src = product.image;
    // productOtherImageContainer.append(productOtherImage);
    // productOtherImages.append(productOtherImageContainer);
    productPageContent.append(productOtherImages);
    page.append(productPageContent);

    // let productOtherImageContainer2 = document.createElement("div");
    // productOtherImageContainer2.className = "product-other-image-container";
    // let productOtherImage2 = document.createElement("img");
    // productOtherImage2.className = "product-other-image";
    // productOtherImage2.src = "";

    for (let image of product.images) {
      let productOtherImageContainer = document.createElement("div");
      productOtherImageContainer.addEventListener("click", function () {
        productThumbnailImage.src = image;
      });
      productOtherImageContainer.className = "product-other-image-container";
      let productOtherImage = document.createElement("img");
      productOtherImage.className = "product-other-image";
      productOtherImage.src = image;
      productOtherImageContainer.append(productOtherImage);
      productOtherImages.append(productOtherImageContainer);
    }
    let productOtherImageContainer = document.createElement("div");
    productOtherImageContainer.addEventListener("click", function () {
      productThumbnailImage.src = product.image;
    });
    productOtherImageContainer.className = "product-other-image-container";
    let productOtherImage = document.createElement("img");
    productOtherImage.className = "product-other-image";
    productOtherImage.src = product.image;
    productOtherImageContainer.append(productOtherImage);
    productOtherImages.prepend(productOtherImageContainer);
    // productOtherImageContainer2.append(productOtherImage2);
    // productOtherImages.append(productOtherImageContainer2);
    // productPageContent.append(productOtherImages);

    // let productOtherImageContainer3 = document.createElement("div");
    // productOtherImageContainer3.className = "product-other-image-container";
    // let productOtherImage3 = document.createElement("img");
    // productOtherImage3.className = "product-other-image";
    // productOtherImage3.src = "";

    // productOtherImageContainer3.append(productOtherImage3);
    // productOtherImages.append(productOtherImageContainer3);
    // productPageContent.append(productOtherImages);

    // let productOtherImageContainer4 = document.createElement("div");
    // productOtherImageContainer4.className = "product-other-image-container";
    // let productOtherImage4 = document.createElement("img");
    // productOtherImage4.className = "product-other-image";

    // productOtherImageContainer4.append(productOtherImage4);
    // productOtherImages.append(productOtherImageContainer4);
    // productPageContent.append(productOtherImages);

    // let productOtherImageContainer5 = document.createElement("div");
    // productOtherImageContainer5.className = "product-other-image-container";
    // let productOtherImage5 = document.createElement("img");
    // productOtherImage5.className = "product-other-image";

    // productOtherImageContainer5.append(productOtherImage5);
    // productOtherImages.append(productOtherImageContainer5);
    // productPageContent.append(productOtherImages);
    // page.append(productPageContent);

    let productThumbnail = document.createElement("div");
    productThumbnail.className = "product-thumbnail";
    let productThumbnailContainer = document.createElement("div");
    productThumbnailContainer.className = "product-thumbnail-container";
    let productThumbnailImage = document.createElement("img");
    productThumbnailImage.className = "product-thumbnail";
    productThumbnailImage.src = product.image;
    productThumbnailContainer.append(productThumbnailImage);
    productThumbnail.append(productThumbnailContainer);
    productPageContent.append(productThumbnail);
    //

    let productInfos = document.createElement("div");
    productInfos.className = "productt-infos";
    let productName = document.createElement("h1");
    productName.className = "productt-name";
    productName.textContent = product.name;
    let productSeller = document.createElement("p");
    productSeller.className = "productt-seller";
    let username = !state.user.username ? "" : `@${state.user.username}`;
    productSeller.textContent = `${username}`;
    let productPrice = document.createElement("h1");
    productPrice.className = "productt-price";
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    let productShipping = document.createElement("h3");
    productShipping.className = "productt-shipping";
    productShipping.textContent = `Shipping: $${product.shipping.toFixed(2)}`;
    productInfos.append(
      productName,
      productSeller,
      productPrice,
      productShipping
    );

    let productDescContainer = document.createElement("div");
    productDescContainer.className = "productt-desc-container";
    let productDesc = document.createElement("p");
    productDesc.className = "productt-desc";
    productDesc.textContent = product.desc;
    productDescContainer.append(productDesc);
    productInfos.append(productDescContainer);

    let productSold = document.createElement("h4");
    productSold.className = "productt-sold";
    productSold.textContent = `Sold ${product.sold}`;
    productInfos.append(productSold);
    productPageContent.append(productInfos);

    //sadsad

    let decision = document.createElement("div");
    decision.className = "decision";
    let decisionUnit = document.createElement("div");
    decisionUnit.className = "decision-unit";
    let decisionUnitText = document.createElement("div");
    let productPriceDecision = document.createElement("h1");
    productPriceDecision.className = "productt-price";
    productPriceDecision.textContent = `$${product.price.toFixed(2)}`;
    let productShippingDecision = document.createElement("h3");
    productShippingDecision.className = "productt-shipping";
    productShippingDecision.textContent = `Shipping: $${product.shipping.toFixed(
      2
    )}`;
    let productOnStockDecision = document.createElement("h4");
    productOnStockDecision.className = "productt-on-stock";
    let inStock = !product.stock ? "No Stock" : "In stock";
    productOnStockDecision.textContent = inStock;
    decisionUnitText.append(
      productPriceDecision,
      productShippingDecision,
      productOnStockDecision
    );
    decisionUnit.append(decisionUnitText);
    decision.append(decisionUnit);
    productPageContent.append(decision);

    let productButtonContainer = document.createElement("div");
    productButtonContainer.className = "productt-button-container";
    let productTotal = document.createElement("h1");
    productTotal.className = "productt-total";
    productTotal.textContent = `Total: $${(
      product.price + product.shipping
    ).toFixed(2)}`;
    let productButtonAddToCart = document.createElement("button");
    productButtonAddToCart.className = "productt-button add-to-cart";
    productButtonAddToCart.textContent = "Add to cart";
    productButtonAddToCart.addEventListener("click", () => {
      addToCart(product);
    });
    let productButtonBuyNow = document.createElement("button");
    productButtonBuyNow.className = "productt-button";
    productButtonBuyNow.textContent = "Buy now";
    productButtonBuyNow.addEventListener("click", () => {
      if (!state.user) {
        div.textContent = "Not loged in";
        div.style = "color: red;";
        return;
      }
      if (state.user.balance < product.price + product.shipping) {
        div.textContent = "Not enough balance";
        div.style = "color: red;";
        return;
      } else {
        div.textContent = "Purchase was successful";
        div.style = "color: green;";
        productSold.textContent = `Sold ${++product.sold}`;
        buyProduct(product);
      }
    });
    productButtonContainer.append(
      productTotal,
      productButtonAddToCart,
      productButtonBuyNow
    );
    decisionUnit.append(productButtonContainer);
    let div = document.createElement("div");
    div.className = "info-about-purchase";

    decision.append(div);
    productPageContent.append(decision);
  } else if (state.page === "profile-page") {
    //   <div class="goback profile-page-goback">
    //   <span class="material-symbols-outlined go-back"> arrow_back </span>
    // </div>
    page = document.querySelector("#profile-page");
    let profilePageGoback = document.createElement("div");
    profilePageGoback.className = "goback profile-page-goback";
    let profilePageGobackIcon = document.createElement("span");
    profilePageGobackIcon.className = "material-symbols-outlined go-back";
    profilePageGobackIcon.textContent = "arrow_back";
    profilePageGoback.append(profilePageGobackIcon);

    page.append(profilePageGoback);
    profilePageGoback.addEventListener("click", () => {
      page.id = "profile-pag";
      page.innerHTML = "";
      page.className = "";
      document.querySelector("#profile-or-product-page").style =
        "display: none;";
      header.style = "display: grid;";
      document.querySelector(".main-container").style = "display: auto;";
      modal.style = "display: grid;";
      state.page = "";
      getProducts();
      // render();
    });

    let profileAvatarInfo = document.createElement("div");
    profileAvatarInfo.className = "profile-avatar-info";
    let profileAvatar = document.createElement("img");
    profileAvatar.className = "profile-page-avatar";
    profileAvatar.src = state.user.userimage;
    let profileUsername = document.createElement("h3");
    profileUsername.className = "profile-username";
    profileUsername.textContent = state.user.username;

    let profileActions = document.createElement("div");
    profileActions.className = "profile-actions";

    let profileAction = document.createElement("div");
    profileAction.className = "profile-action";
    profileAction.textContent = "Order history";

    let profileAction2 = document.createElement("div");
    profileAction2.className = "profile-action";
    profileAction2.textContent = "Your products";

    let profileAction3 = document.createElement("div");
    profileAction3.className = "profile-action";
    profileAction3.textContent = "Edit profile";
    profileAction3.addEventListener("click", function () {
      actionArea.innerHTML = "";
      let action = document.createElement("div");
      action.textContent = "Change profile picture";
      action.className = "profile-action action";
      action.addEventListener("click", function () {
        actionArea.innerHTML = "";
        let divgobck = document.createElement("div");
        divgobck.className = "action gobck";
        let gobck = document.createElement("span");
        gobck.className = "material-symbols-outlined go-bck";
        gobck.textContent = "arrow_back";
        gobck.addEventListener("click", function () {
          actionArea.innerHTML = "";
          action1.textContent = "Change username";
          action1.className = "profile-action action";
          action2.textContent = "Change password";
          action2.className = "profile-action action";
          actionArea.append(action, action1, action2);
        });
        divgobck.appendChild(gobck);
        actionArea.prepend(divgobck);
        actionArea.append(action);
        action1.textContent = "";
        action2.textContent = "";
        let profileForm = document.createElement("form");
        profileForm.className = "action profileForm";
        profileForm.addEventListener("submit", function (e) {
          e.preventDefault();
          state.user.userimage = profileInput.value;
          profileAvatar.src = state.user.userimage;
          fetch(`http://localhost:3007/users/${state.user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: `${JSON.stringify(state.user)}`,
          });
        });
        let profileInput = document.createElement("input");
        profileInput.placeholder = "Type an image URL";
        profileInput.className = "profile-input";
        profileForm.append(profileInput);
        actionArea.append(profileForm);
      });
      let action1 = document.createElement("div");
      action1.textContent = "Change username";
      action1.className = "profile-action action";
      action1.addEventListener("click", function () {
        actionArea.innerHTML = "";
        let divgobck = document.createElement("div");
        divgobck.className = "action gobck";
        let gobck = document.createElement("span");
        gobck.className = "material-symbols-outlined go-bck";
        gobck.textContent = "arrow_back";
        gobck.addEventListener("click", function () {
          actionArea.innerHTML = "";
          action.textContent = "Change profile picture";
          action.className = "profile-action action";
          action2.textContent = "Change password";
          action2.className = "profile-action action";
          actionArea.append(action, action1, action2);
        });
        divgobck.appendChild(gobck);
        actionArea.prepend(divgobck);
        actionArea.append(action1);
        action.textContent = "";
        action2.textContent = "";
        let profileForm = document.createElement("form");
        profileForm.className = "action profileForm";
        profileForm.addEventListener("submit", function (e) {
          e.preventDefault();
          state.user.username = profileInput.value;
          profileUsername.textContent = state.user.username;
          fetch(`http://localhost:3007/users/${state.user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: `${JSON.stringify(state.user)}`,
          });
        });
        let profileInput = document.createElement("input");
        profileInput.placeholder = "Type a new username";
        profileInput.className = "profile-input";
        profileForm.append(profileInput);
        actionArea.append(profileForm);
      });
      let action2 = document.createElement("div");
      action2.textContent = "Change password";
      action2.className = "profile-action action";
      action2.addEventListener("click", function () {
        actionArea.innerHTML = "";
        let divgobck = document.createElement("div");
        divgobck.className = "action gobck";
        let gobck = document.createElement("span");
        gobck.className = "material-symbols-outlined go-bck";
        gobck.textContent = "arrow_back";
        gobck.addEventListener("click", function () {
          actionArea.innerHTML = "";
          action.textContent = "Change profile picture";
          action.className = "profile-action action";
          action1.textContent = "Change username";
          action1.className = "profile-action action";
          actionArea.append(action, action1, action2);
        });
        divgobck.appendChild(gobck);
        actionArea.prepend(divgobck);
        actionArea.append(action2);
        action.textContent = "";
        action1.textContent = "";
        let profileForm = document.createElement("form");
        profileForm.className = "action profileForm";
        profileForm.addEventListener("submit", function (e) {
          e.preventDefault();
          if (profileInput.value !== state.user.password) {
            message.textContent = "Error";
          } else {
            message.textContent = "";
            if (profileInput1.value === profileInput2.value) {
              message.textContent = "Changed password succesfully";
              message.className = "passed-message profile-action ";
              state.user.password = profileInput1.value;
              fetch(`http://localhost:3007/users/${state.user.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: `${JSON.stringify(state.user)}`,
              });
            } else {
              message.textContent = "Error";
            }
          }
        });
        let submit = document.createElement("input");
        submit.type = "submit";
        submit.className = "profile-action action pass-submit";
        let profileInput = document.createElement("input");
        profileInput.type = "password";
        profileInput.placeholder = "Type old password";
        profileInput.className = "pass-input";
        let profileInput1 = document.createElement("input");
        profileInput1.type = "password";
        profileInput1.placeholder = "Type new password";
        profileInput1.className = "pass-input";
        let profileInput2 = document.createElement("input");
        profileInput2.type = "password";
        profileInput2.placeholder = "Reconfirm new password";
        profileInput2.className = "pass-input";
        let message = document.createElement("div");
        message.className = "pass-message profile-action";

        profileForm.append(
          profileInput,
          profileInput1,
          profileInput2,
          message,
          submit
        );
        actionArea.append(profileForm);
      });
      actionArea.append(action, action1, action2);
    });

    let profileAction4 = document.createElement("div");
    profileAction4.className = "profile-action";
    profileAction4.textContent = "Sell your products";
    profileAction4.addEventListener("click", function () {
      actionArea.innerHTML = "";
      let addProductForm = document.createElement("form");
      addProductForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let addedProduct = {
          categories: [
            el7Input.value,
            el7Input2.value,
            el7Input3.value,
            el7Input4.value,
          ],
          name: el2Input.value,
          image: el1Input.value,
          price: Number(el3Input.value),
          stock: Number(el8Input.value),
          shipping: Number(el4Input.value),
          seller: state.user.username,
          desc: el5Input.value,
          images: [
            // el6Input.value,
            // el6Input2.value,
            // el6Input3.value,
            // el6Input4.value,
          ],
          sold: 0,
          id:
            JSON.parse(
              JSON.stringify(state.products[state.products.length - 1].id)
            ) + 1,
        };
        console.log(addedProduct);
        if (el6Input.value !== "") {
          addedProduct.images.push(el6Input.value);
        }
        if (el6Input2.value !== "") {
          addedProduct.images.push(el6Input2.value);
        }
        if (el6Input3.value !== "") {
          addedProduct.images.push(el6Input3.value);
        }
        if (el6Input4.value !== "") {
          addedProduct.images.push(el6Input4.value);
        }
        state.user.selling.push(addedProduct);
        fetch("http://localhost:3006/products", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: `${JSON.stringify(addedProduct)}`,
        });
        fetch(`http://localhost:3007/users/${state.user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: `${JSON.stringify(state.user)}`,
        });
      });
      let divEl1 = document.createElement("div");
      divEl1.className = "sell-your-products";
      let el1 = document.createElement("h4");
      el1.textContent = "Add a product image";
      let el1Input = document.createElement("input");
      divEl1.append(el1, el1Input);
      let divEl2 = document.createElement("div");
      divEl2.className = "sell-your-products";
      let el2 = document.createElement("h4");
      el2.textContent = "Add a product title";
      let el2Input = document.createElement("input");
      divEl2.append(el2, el2Input);
      let divEl3 = document.createElement("div");
      divEl3.className = "sell-your-products";
      let el3 = document.createElement("h4");
      el3.textContent = "Add product price";
      let el3Input = document.createElement("input");
      el3Input.type = "number";
      divEl3.append(el3, el3Input);
      let divEl4 = document.createElement("div");
      divEl4.className = "sell-your-products";
      let el4 = document.createElement("h4");
      el4.textContent = "Add a product shipping price";
      let el4Input = document.createElement("input");
      el4Input.type = "number";
      let divEl5 = document.createElement("div");
      divEl5.className = "sell-your-products";
      let el5 = document.createElement("h4");
      el5.textContent = "Add product descripiton";
      let el5Input = document.createElement("input");
      let divEl6 = document.createElement("div");
      divEl6.className = "sell-your-products";
      let el6 = document.createElement("h4");
      el6.textContent = "Add other images of the product";
      let el6Input = document.createElement("input");
      let el6Input2 = document.createElement("input");
      let el6Input3 = document.createElement("input");
      let el6Input4 = document.createElement("input");
      let divEl7 = document.createElement("div");
      divEl7.className = "sell-your-products";
      let el7 = document.createElement("h4");
      el7.textContent = "Add product categories";
      let el7Input = document.createElement("input");
      let el7Input2 = document.createElement("input");
      let el7Input3 = document.createElement("input");
      let el7Input4 = document.createElement("input");
      let divEl8 = document.createElement("div");
      divEl8.className = "sell-your-products";
      let el8 = document.createElement("h4");
      el8.textContent = "Add product stock";
      let el8Input = document.createElement("input");
      el8Input.type = "number";
      divEl4.append(el4, el4Input);
      divEl5.append(el5, el5Input);
      divEl8.append(el8, el8Input);
      divEl6.append(el6, el6Input, el6Input2, el6Input3, el6Input4);
      divEl7.append(el7, el7Input, el7Input2, el7Input3, el7Input4);
      let addProdSubmit = document.createElement("input");
      addProdSubmit.type = "submit";
      addProductForm.append(
        divEl1,
        divEl2,
        divEl3,
        divEl4,
        divEl5,
        divEl6,
        divEl7,
        divEl7,
        divEl8,
        addProdSubmit
      );
      actionArea.appendChild(addProductForm);
    });

    let profileAction5 = document.createElement("div");
    profileAction5.className = "profile-action";
    profileAction5.textContent = "Cart";

    profileActions.append(
      profileAction,
      profileAction2,
      profileAction3,
      profileAction4,
      profileAction5
    );
    profileAvatarInfo.append(profileAvatar, profileUsername);
    page.append(profileAvatarInfo, profileActions);

    let actionArea = document.createElement("div");
    actionArea.className = "action-area";
    // let cartProdSection = document.createElement("div");
    // cartProdSection.className = "cart-prod-section order-history-prods";

    // let cartProd = document.createElement("div");
    // cartProd.className = "cart-prod order-prod";

    page.appendChild(actionArea);
    // actionArea.appendChild(cartProdSection);

    profileAction.addEventListener("click", function () {
      actionArea.innerHTML = "";
      let cartProdSection = document.createElement("div");
      cartProdSection.className = "cart-prod-section order-history-prods";
      actionArea.appendChild(cartProdSection);
      for (let productt of state.user.bought) {
        let cartProd = document.createElement("div");
        cartProd.className = "cart-prod order-prod";
        cartProdSection.appendChild(cartProd);

        let cartProdImage = document.createElement("img");
        cartProdImage.className = "cart-prod-image";
        cartProdImage.src = productt.image;
        let cartProdInfos = document.createElement("div");
        cartProdInfos.className = "cart-prod-infos";

        cartProd.append(cartProdImage, cartProdInfos);

        let namePrice = document.createElement("div");
        namePrice.className = "name-price";
        let namePriceSpan = document.createElement("span");
        namePriceSpan.className = "name-price";
        let namePriceStrong = document.createElement("strong");
        namePriceStrong.textContent = productt.name;
        let namePriceSpan2 = document.createElement("span");
        namePriceSpan2.className = "name-price";
        let namePriceStrong2 = document.createElement("strong");
        namePriceStrong2.className = "cart-prod-price";
        namePriceStrong2.textContent = `$${productt.price.toFixed(2)}`;

        namePriceSpan.appendChild(namePriceStrong);
        namePriceSpan2.appendChild(namePriceStrong2);
        namePrice.append(namePriceSpan, namePriceSpan2);

        let po = document.createElement("div");
        po.className = "po";
        let poSpan = document.createElement("span");
        poSpan.className = "cart-prod-info";
        poSpan.textContent = productt.desc;

        po.appendChild(poSpan);

        let po2 = document.createElement("div");
        po2.className = "po";
        let poSpan2 = document.createElement("span");
        poSpan2.className = "cart-prod-info";
        poSpan2.textContent = `Shipping: $${productt.shipping.toFixed(2)}`;

        po2.appendChild(poSpan2);

        let div = document.createElement("div");

        cartProdInfos.append(namePrice, po, po2, div);
        cartProd.append(cartProdImage, cartProdInfos);
      }
    });
    profileAction2.addEventListener("click", function () {
      actionArea.innerHTML = "";
      let cartProdSection = document.createElement("div");
      cartProdSection.className = "cart-prod-section order-history-prods";
      actionArea.appendChild(cartProdSection);
      for (let i = 0; i < state.user.selling.length; i++) {
        console.log("asfaf");
        let cartProd = document.createElement("div");
        cartProd.className = "cart-prod order-prod";
        cartProdSection.appendChild(cartProd);

        let cartProdImage = document.createElement("img");
        cartProdImage.className = "cart-prod-image";
        cartProdImage.src = state.user.selling[i].image;
        let cartProdInfos = document.createElement("div");
        cartProdInfos.className = "cart-prod-infos";

        cartProd.append(cartProdImage, cartProdInfos);

        let namePrice = document.createElement("div");
        namePrice.className = "name-price";
        let namePriceSpan = document.createElement("span");
        namePriceSpan.className = "name-price";
        let namePriceStrong = document.createElement("strong");
        namePriceStrong.textContent = state.user.selling[i].name;
        let namePriceSpan2 = document.createElement("span");
        namePriceSpan2.className = "name-price";
        let namePriceStrong2 = document.createElement("strong");
        namePriceStrong2.className = "cart-prod-price";
        namePriceStrong2.textContent = `$${state.user.selling[i].price.toFixed(
          2
        )}`;

        namePriceSpan.appendChild(namePriceStrong);
        namePriceSpan2.appendChild(namePriceStrong2);
        namePrice.append(namePriceSpan, namePriceSpan2);

        let po = document.createElement("div");
        po.className = "po";
        let poSpan = document.createElement("span");
        poSpan.className = "cart-prod-info";
        poSpan.textContent = state.user.selling[i].desc;

        po.appendChild(poSpan);

        let po2 = document.createElement("div");
        po2.className = "po";
        let poSpan2 = document.createElement("span");
        poSpan2.className = "cart-prod-info";
        poSpan2.textContent = `Shipping: $${state.user.selling[
          i
        ].shipping.toFixed(2)}`;

        po2.appendChild(poSpan2);

        let po3 = document.createElement("div");
        po3.className = "po";
        let removeBtn = document.createElement("button");
        removeBtn.className = "cart-prod-info cart-prod-remove-btn";
        removeBtn.textContent = "Remove from selling list";
        removeBtn.addEventListener("click", function () {
          fetch(`http://localhost:3006/products/${state.user.selling[i].id}`, {
            method: "DELETE",
          });
          let item = JSON.parse(
            JSON.stringify(state.user.selling[state.user.selling.length - 1])
          );
          state.user.selling[state.user.selling.length - 1] = JSON.parse(
            JSON.stringify(state.user.selling[i])
          );

          state.user.selling[i] = item;
          console.log(
            state.user.selling[i] === state.user.selling[state.user.selling - 1]
          );
          state.user.selling.pop();
          fetch(`http://localhost:3007/users/${state.user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: `${JSON.stringify(state.user)}`,
          });
          cartProd.remove();
        });
        po3.appendChild(removeBtn);

        let div = document.createElement("div");

        cartProdInfos.append(namePrice, po, po2, po3, div);
        cartProd.append(cartProdImage, cartProdInfos);
      }
    });
    profileAction5.addEventListener("click", function () {
      actionArea.innerHTML = "";
      let cartProdSection = document.createElement("div");
      cartProdSection.className = "cart-prod-section order-history-prods";
      actionArea.appendChild(cartProdSection);
      for (let i = 0; i < state.user.onCart.length; i++) {
        console.log("asfaf");
        let cartProd = document.createElement("div");
        cartProd.className = "cart-prod order-prod";
        cartProdSection.appendChild(cartProd);

        let cartProdImage = document.createElement("img");
        cartProdImage.className = "cart-prod-image";
        cartProdImage.src = state.user.onCart[i].image;
        let cartProdInfos = document.createElement("div");
        cartProdInfos.className = "cart-prod-infos";

        cartProd.append(cartProdImage, cartProdInfos);

        let namePrice = document.createElement("div");
        namePrice.className = "name-price";
        let namePriceSpan = document.createElement("span");
        namePriceSpan.className = "name-price";
        let namePriceStrong = document.createElement("strong");
        namePriceStrong.textContent = state.user.onCart[i].name;
        let namePriceSpan2 = document.createElement("span");
        namePriceSpan2.className = "name-price";
        let namePriceStrong2 = document.createElement("strong");
        namePriceStrong2.className = "cart-prod-price";
        namePriceStrong2.textContent = `$${state.user.onCart[i].price.toFixed(
          2
        )}`;

        namePriceSpan.appendChild(namePriceStrong);
        namePriceSpan2.appendChild(namePriceStrong2);
        namePrice.append(namePriceSpan, namePriceSpan2);

        let po = document.createElement("div");
        po.className = "po";
        let poSpan = document.createElement("span");
        poSpan.className = "cart-prod-info";
        poSpan.textContent = state.user.onCart[i].desc;

        po.appendChild(poSpan);

        let po2 = document.createElement("div");
        po2.className = "po";
        let poSpan2 = document.createElement("span");
        poSpan2.className = "cart-prod-info";
        poSpan2.textContent = `Shipping: $${state.user.onCart[
          i
        ].shipping.toFixed(2)}`;

        po2.appendChild(poSpan2);

        let po3 = document.createElement("div");
        po3.className = "po";
        let removeBtn = document.createElement("button");
        removeBtn.className = "cart-prod-info cart-prod-remove-btn";
        removeBtn.textContent = "Remove from cart";
        removeBtn.addEventListener("click", function () {
          let item = JSON.parse(
            JSON.stringify(state.user.onCart[state.user.onCart.length - 1])
          );
          state.user.onCart[state.user.onCart.length - 1] = JSON.parse(
            JSON.stringify(state.user.onCart[i])
          );

          state.user.onCart[i] = item;
          console.log(
            state.user.onCart[i] === state.user.onCart[state.user.onCart - 1]
          );
          state.user.onCart.pop();
          fetch(`http://localhost:3007/users/${state.user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: `${JSON.stringify(state.user)}`,
          });
          cartProd.remove();
        });

        po3.appendChild(removeBtn);
        let div = document.createElement("div");

        cartProdInfos.append(namePrice, po, po2, po3, div);
        cartProd.append(cartProdImage, cartProdInfos);
      }
    });
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

// createFooter();

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
  if (product.sold === undefined) {
    console.log("assad");
    prodSold.textContent = "";
  }

  stockDiv.append(p1, p2);
  prodImgWrapper.appendChild(prodImg);
  if (product.stock === 0) {
    let soldOut = document.createElement("h1");
    soldOut.textContent = "SOLD";
    soldOut.className = "sold-out";
    prodImg.prepend(soldOut);
  }
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
        console.log("wow");
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
  fetch(`http://localhost:3006/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: `${JSON.stringify(product)}`,
  });
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
function goBack() {
  state.modal = "";
  render();
}
