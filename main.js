import api from './services/api'
import './style.css'


/*----------- SLIDER ------------*/

let swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // navigation: {
  //   nextEl: ".swiper-button-next",
  //   prevEl: ".swiper-button-prev",
  // },
});


/*------------ NAVBAR MAIN -------------*/

let nav_main = document.getElementById('nav-main')
nav_main.innerHTML = `     
                    <ul >
                      <li>
                      <a class="logo" href="/"><img src="./img/pj_logo.png" alt=""></a> 
                      </li>
                      <li><a class="text-lg color-white" href="">KAMPANIYALAR</a></li>
                      <li><a id="papadiaz" class="text-lg color-white" href="">PAPADIAZ</a></li>
                      <li><a id="pizzas" class="text-lg color-white" href="">PIZZA</a></li>
                      <li><a id="qelyanalti" class="text-lg color-white" href="">QELYANALTI</a></li>
                      <li><a id="salat" class="text-lg color-white" href="">SALAT</a></li>
                      <li><a id="pasta" class="text-lg color-white" href="">PASTA</a></li>
                      <li><a id="icki" class="text-lg color-white" href="">ICKI</a></li>
                      <li><a id="desert" class="text-lg color-white" href="">DESERT</a></li>
                      <li><a id="sous" class="text-lg color-white" href="">SOUS</a></li>
                    </ul>

`

/*------------- FETCH DATA FROM API --------------*/

let DATA = null

async function getMainData() {
  let fullData = await api.getAllData()
  DATA = fullData
  getAllPagesDatas(DATA)
}

getMainData()


/*---------- GETTING ALL DATAS FROM ALL PAGES ----------*/

function getAllPagesDatas(DATA) {
  goPapaDiaz(DATA)
  goPizzas(DATA)
  goQelyanlati(DATA)
  goSalats(DATA)
  goDrinks(DATA)
  goDesserts(DATA)
  goSouss(DATA)
}



const container = document.getElementById('container')


/*----------------------- POPUP MENU  ------------------------*/

const popup = document.getElementById('popup');

/*------- TRANSPARENT BACKGROUND -------*/

const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
overlay.style.zIndex = 5;
overlay.style.display = 'none';
document.body.appendChild(overlay);



/*-- Default Bag Is Empty --*/
bagCount.style.display = 'none';

let basketItems = [];
let totalItemsInBasket = 0;

function createPopup(item) {
  popup.innerHTML = "";
  popup.style.display = "block";

  const defaultPrice = typeof item.price == 'object' ? (item.price.xs || item.price.sm || item.price.md || item.price.lg || 'muveqqeti olaraq movcud deyil') : item.price.toFixed(2);

  let sizes = ['xs', 'sm', 'md', 'lg'];
  let sizeOflabel = {
    xs: 'Mini Pizza, 15sm',
    sm: 'Kicik Pizza, 23sm',
    md: 'Orta Pizza, 30sm',
    lg: 'Boyuk Pizza, 35sm'
  };

  let optionsHTML = "";

  sizes.forEach(size => {
    if (item.price[size]) {
      optionsHTML += `<option value="${size}">${sizeOflabel[size]}: ${item.price[size]} m</option>`;
    }
  });

  popup.innerHTML = `
    <div class="pop">
      <div class="close">
        <p><!-- placeholder for flex --></p>
        <button onclick="bagla()">Bagla <span><i class="fa-solid fa-circle-xmark"></i></span></button>
      </div>
      <div class="image-pop">
        <img src="${item.img}" alt="">
      </div>
      <h3 class="text-lg">${item.name}</h3>
      <div class="select-container">
        <select id="priceSelect" onchange="changePrice()" class="select-box  ${typeof item.price == 'number' ? 'none' : ''}">
           ${optionsHTML}
        </select>
        <div class="icon-container ">
          <i class="fa-solid fa-caret-down"> </i>
        </div>
      </div>
      <div class="countSection">
        <div id="count" class="countOfpizza">
          <button class="azaltBtn" onclick="sayiDeyis(-1)">-</button>
          <input id="sayi" type="text" readonly min="1" max="10" value="1">
          <button class="coxaltBtn" onclick="sayiDeyis(1)">+</button>
        </div>
        <p id="price" class="price text-xl">${defaultPrice} m</p>
      </div>
      <div class="basket">
        <p></p>
        <button id="addToBasket" class="btn-addToBasket">Sebete At</button>
      </div>
    </div>
  `;

  overlay.style.display = 'block';

  window.bagla = () => {
    popup.style.display = "none";
    overlay.style.display = 'none';
  };

  window.onclick = function(event){
    if(event.target == overlay){
      overlay.style.display = 'none';
      popup.style.display = "none";
    }
  }

  let n = 1;
  const priceOfmeal = document.getElementById('price');
  const sayi = document.getElementById('sayi');
  const priceSelect = document.getElementById('priceSelect');

  let currentSize = priceSelect.value || 'xs';
  let currentPrice = parseFloat(item.price[currentSize]) || defaultPrice;

  window.changePrice = () => {
    if (priceSelect) {
      currentSize = priceSelect.value;
      currentPrice = parseFloat(item.price[currentSize]);
    }
    const total = currentPrice * n;
    priceOfmeal.textContent = `${total.toFixed(2)} m`;
  };

  window.sayiDeyis = (x) => {
    if (x == 1) {
      if (n < 10) n++;
    } else if (x == -1) {
      if (n > 1) n--;
    }
    sayi.value = n;
    const total = currentPrice * n;
    priceOfmeal.textContent = `${total.toFixed(2)} m`;
  };

  document.getElementById('addToBasket').addEventListener('click', () => {
    const existingItemIndex = basketItems.findIndex(basketItem => basketItem.id === item.id && basketItem.size === currentSize);
    if (existingItemIndex !== -1) {
      basketItems[existingItemIndex].quantity += n;
    } else {
      basketItems.push({
        ...item,
        size: currentSize,
        quantity: n,
        price: currentPrice
      });
    }
    totalItemsInBasket += n;

    if (totalItemsInBasket > 0) {
      bagCount.style.display = 'block';
      bagCount.textContent = totalItemsInBasket;
    } else {
      bagCount.style.display = 'none';
    }

    window.bagla();
  });
}


/*------------- PAPADIAZ -------------*/
const papadiaz = document.getElementById('papadiaz')
const pizza_types = document.getElementById('pizzaTypes')


function goPapaDiaz(DATA) {

  papadiaz.addEventListener('click', function (e) {
    e.preventDefault()

    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'Papadias')

    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                    <div class="card">
                                      <img src="${item.img}" alt="pizza">
                                      <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                      <div class="card-body">
                                        <div>
                                          <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                          <button class="btn">BUNU SEÇ</button>
                                        </div>
                                        <p></p>
                                        <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                      </div>
                                  </article>

                  `

    })



    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        let selectedItem = filteredData[i];
        createPopup(selectedItem);
      });
    });
  });
}


/*------------- PIZZALAR -------------*/

const pizzas = document.getElementById('pizzas')

function goPizzas(DATA) {
  pizzas.addEventListener('click', function (e) {
    e.preventDefault()
    pizzaTypes(DATA)
    container.innerHTML = ""
    const filteredData = DATA?.filter(item => item.category == 'Pizzalar')

    filteredData.forEach((item, i) => {
      container.innerHTML += `
                              
                                <article>
                                    <div class="card">
                                      <img src="${item.img}" alt="pizza">
                                      <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                      <div class="card-body">
                                        <div>
                                          <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                          <button id="b${i}" class="btn">BUNU SEÇ</button>
                                        </div>
                                        <p></p>
                                        <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                      </div>
                                  </article>

                  `

    })


    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });
  })
}

function pizzaTypes(DATA) {
  pizza_types.innerHTML = `
                        <div class="categories">
                          <p class="text-md"><a id="hamisi" href="">Hamısı</a></p>
                          <p class="text-md"><a id="toyuqlu" href="">Toyuqlu</a></p>
                          <p class="text-md"><a id="et" href="">Ət ilə</a></p>
                          <p class="text-md"><a id="vegetarian" href="">Vegetarian</a></p>
                          <p class="text-md"><a id="acili" href="">Acılı</a></p>
                        </div>

    `


  const hamisi = document.getElementById("hamisi")
  const toyuqlu = document.getElementById("toyuqlu")
  const etIle = document.getElementById("et")
  const vegetarian = document.getElementById("vegetarian")
  const acili = document.getElementById("acili")



  /*------------- GET ALL PIZZAS  --------------*/

  hamisi.addEventListener('click', function (e) {
    e.preventDefault()
    container.innerHTML = ''

    const filteredData = DATA?.filter(item => item.category == 'Pizzalar')
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                                </article>
          `
    })


    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });


  })

  /*-----------  GET CHICKEN PIZZAS  ------------*/

  toyuqlu.addEventListener('click', function (e) {
    e.preventDefault()
    container.innerHTML = ''

    const filteredData = DATA?.filter(item => item.cath != undefined && item.cath.includes('chick'))
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                                </article>
          `
    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });



  })

  /*-----------  GET MEAT PIZZAS  ------------*/

  etIle.addEventListener('click', function (e) {
    e.preventDefault()
    container.innerHTML = ''

    const filteredData = DATA?.filter(item => item.cath != undefined && item.cath.includes('meat'))
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                                </article>
          `
    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });
  })

  /*-----------  GET VEGETARIAN PIZZAS  ------------*/

  vegetarian.addEventListener('click', function (e) {
    e.preventDefault()
    container.innerHTML = ''

    const filteredData = DATA?.filter(item => item.cath != undefined && item.cath.includes('vegan'))
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                                </article>
          `
    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });
  })

  /*-----------  GET SPICY PIZZAS  ------------*/

  acili.addEventListener('click', function (e) {
    e.preventDefault()
    container.innerHTML = ''

    const filteredData = DATA?.filter(item => item.cath != undefined && item.cath.includes('spicy'))
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                                <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                                </article>
          `
    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });


  })

}


/*------------- QELYANALTI -------------*/

const qelyanalti = document.getElementById('qelyanalti')

function goQelyanlati(DATA) {

  qelyanalti.addEventListener('click', function (e) {
    e.preventDefault()

    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'Qelyanaltılar')
    filteredData.forEach((item, i) =>
      container.innerHTML += `
                            <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                            </article>
       
       `

    )

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });



  })


}


/*------------- SALATLAR -------------*/

const salat = document.getElementById('salat')

function goSalats(DATA) {

  salat.addEventListener('click', function (e) {
    e.preventDefault()

    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'Salatlar')
    filteredData.forEach((item, i) => {

      container.innerHTML += `
                            <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"> ${item.composition}</p>
                                    </div>
                            </article>
       
       `

    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });
  })


}


/*------------- ICKI -------------*/

const icki = document.getElementById('icki')

function goDrinks(DATA) {
  icki.addEventListener('click', function (e) {
    e.preventDefault()

    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'İçkilər')
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                            <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"></p>
                                    </div>
                            </article>
       
       `

    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });
  })

}

/*------------- DESSERT -------------*/

const dessert = document.getElementById('desert')

function goDesserts(DATA) {
  dessert.addEventListener('click', function (e) {
    e.preventDefault()

    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'Desserts')
    filteredData.forEach((item, i) => {
      container.innerHTML += `
                            <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"></p>
                                    </div>
                            </article>
       
       `

    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });


  })

}


/*------------- SOUS -------------*/

const sous = document.getElementById('sous')

function goSouss(DATA) {

  sous.addEventListener('click', function (e) {
    e.preventDefault()
    pizza_types.innerHTML = ""  //BU KATEGORIYA YALNIZ PIZZALAR UCUN KECERLIDIR..

    container.innerHTML = ""

    const filteredData = DATA?.filter(item => item.category == 'Souslar')
    filteredData.forEach((item, i) => {

      container.innerHTML += `
                            <article>
                                  <div class="card">
                                    <img src="${item.img}" alt="pizza">
                                    <p id="discount-${i}" class="discount" style="display: none;">-50%</p>
                                    <div class="card-body">
                                      <div>
                                        <h5 id="name" class="text-sm color-black">${item.name}</h5>
                                        <button class="btn">BUNU SEÇ</button>
                                      </div>
                                      <p></p>
                                      <p id="description" class="text-sm-regular"></p>
                                    </div>
                            </article>
       
       `

    })

    /*------------ POPUP MENU UCUN KLIK ET  --------------*/
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button, i) => {
      button.addEventListener('click', function () {
        const selectedItem = filteredData[i];
        createPopup(selectedItem);

      });
    });

  })
}





const promocodeValue = document.getElementById('promocode');
const promocodeButton = document.getElementById('promocodeButton');
const apasniZahid = "apasniZahid";

const bag = document.getElementById('bag');
const checkOut = document.getElementById('checkout');
const overAll = document.getElementById('overAll');
const mehsullar = document.getElementById("mehsullar");
let itemPrice = 1;
let kod = 0;

bag.addEventListener('click', function (e) {
  e.preventDefault();
  overlay.style.display = 'block';
  checkOut.style.display = 'block';

  renderBasketItems();
});

function renderBasketItems() {
  mehsullar.innerHTML = '';
  kod = 0;

  basketItems.forEach((item) => {
    mehsullar.innerHTML += showBasket(item);
    let itemTotalPrice = item.price * item.quantity;
    kod += itemTotalPrice;
  });

  overAll.innerHTML = kod.toFixed(2);
}

function showBasket(item) {
  let itemTotalPrice = item.price * item.quantity;

  return `<div id="basket-item-${item.id}-${item.size}">
            <div>
              <img style="width: 100px; height: 80px;" src="${item.img}" alt="">
            </div>
            <div class="mehsulunAdi">
              <div class="text-md">${item.name} </div>
              <div>${item.composition.slice(0, 28)}</div>
            </div>
            <div class="countOfpizza">
              <button class="azaltBtn" onclick="sayiDeyiss(-1, ${item.id}, '${item.size}')">-</button>
              <input id="sayii-${item.id}-${item.size}" type="text" readonly min="1" max="10" value="${item.quantity}">
              <button class="coxaltBtn" onclick="sayiDeyiss(1, ${item.id}, '${item.size}')">+</button>
            </div>
            <div class="qiymet">
              <p><span id="itemPrice-${item.id}-${item.size}" class="text-md">${itemTotalPrice.toFixed(2)}</span> <b style="font-family: 'Helvetica Neue';"> m </b> &nbsp;&nbsp; <a id="sil" onclick="productSil(${item.id}, '${item.size}')" style="color: black;" href="javascript:void(0);" class="fa-solid fa-circle-xmark"></a></span></p>
            </div>
          </div>`;
}

window.sayiDeyiss = (x, id, size) => {
  const item = basketItems.find(item => item.id === id && item.size === size);
  if (item) {
    if (item.quantity <= 1 && x === -1) {
      item.quantity = 1;
    } else if (item.quantity >= 10 && x === 1) {
      item.quantity = 10;
    } else {
      item.quantity += x;
    }

    renderBasketItems();
    updateBagCount();
  }
};

window.productSil = (id, size) => {
  const itemToRemove = basketItems.find(item => item.id === id && item.size === size);
  if (itemToRemove) {
    totalItemsInBasket -= itemToRemove.quantity;
  }
  basketItems = basketItems.filter(item => !(item.id === id && item.size === size));

  renderBasketItems();
  updateBagCount();
};

window.closeCheckout = () => {
  overlay.style.display = 'none';
  checkOut.style.display = 'none';
};

function updateBagCount() {
  if (totalItemsInBasket > 0) {
    bagCount.style.display = 'block';
    bagCount.textContent = totalItemsInBasket;
  } else {
    bagCount.style.display = 'none';
  }
}

promocodeButton.addEventListener('click', function () {
  const promoCode = promocodeValue.value;

  if (promoCode === apasniZahid) {
    basketItems = basketItems.map(item => {
      item.price /= 2;
      return item;
    });

    renderBasketItems();
    showDiscountTags(true);
  } else {
    alert('Invalid Promo Code');
  }
});


function showDiscountTags(show) {
  const discountTags = document.querySelectorAll('.discount');
  discountTags.forEach(tag => {
    tag.style.display = show ? 'block' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  showDiscountTags(false);
});


// Promo code handling for popup
function applyPopupPromocode(item) {
  if (promocodeValue.value === apasniZahid) {
    const priceSelect = document.getElementById('priceSelect');
    if (priceSelect) {
      let currentSize = priceSelect.value || 'xs';
      item.price[currentSize] /= 2;
      changePrice();
    } else {
      item.price /= 2;
      document.getElementById('price').textContent = `${item.price.toFixed(2)} m`;
    }
  }
}





// Update the popup to include promo code application
document.getElementById('addToBasket').addEventListener('click', () => {
  applyPopupPromocode(item);
  const existingItemIndex = basketItems.findIndex(basketItem => basketItem.id === item.id && basketItem.size === currentSize);
  if (existingItemIndex !== -1) {
    basketItems[existingItemIndex].quantity += n;
  } else {
    basketItems.push({
      ...item,
      size: currentSize,
      quantity: n,
      price: currentPrice
    });
  }
  totalItemsInBasket += n;
  updateBagCount();
  window.bagla();
});
