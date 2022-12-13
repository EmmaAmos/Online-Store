function getLocalStorage(a) {
  return JSON.parse(localStorage.getItem(a));
}
function getCartContents() {
  let a = "";
  const r = getLocalStorage("so-cart"),
    c = r.map((t) => renderCartItem(t));
  document.querySelector(".product-list").innerHTML = c.join("");
}
function renderCartItem(a) {
  const r = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${a.Image}"
      alt="${a.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${a.Name}</h2>
  </a>
  <p class="cart-card__color">${a.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${a.FinalPrice}</p>
</li>`;
  return console.log(r), r;
}
getCartContents();

//code copied from DOM Project
const button = document.querySelector('button');

button.onclick = function () {
  const list = document.querySelector('ul');
  const input = document.getElementById("favchap");

  if (required(input)) {
    let myItem = input.value;
    input.value = '';

    const listItem = document.createElement('li');
    const listText = document.createElement('span');
    const listBtn = document.createElement('button');

    listItem.appendChild(listText);
    listText.innerHTML = myItem;
    listItem.appendChild(listBtn);
    listBtn.innerHTML = '❌';
    list.appendChild(listItem);

    if (!listBtn.onclick) {
      listBtn.onclick = function (e) {
        list.removeChild(listItem);
      }
    }
    input.focus();
  }
}

// If the length of the element's string is 0 then display helper message 

function required(input) {

  if (input.value.length >= 6) {
    //don't use alerts stick to messages
    alert("Please, add your favorite chapter");
    return false;
  }
  return true;
}