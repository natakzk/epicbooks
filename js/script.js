ready(function(){

  // В этом месте должен быть написан ваш код
let fragment = document.createDocumentFragment();
let booksArr = books.splice(0, 12);
const burgerButton = document.querySelector('.burger');
const filtersButton = document.querySelector('.filters__trigger');
const modal = document.querySelector('.modal');
const modalDialog = document.querySelector('.modal__dialog');
const mainNav = document.querySelector('.main-nav');
const catalogBooksList = document.querySelector('.catalog__books-list');
const modalTemplate = document.querySelector('#modal__template');
const cardTemplate = document.querySelector('#card__template');
const catalog = document.querySelector('.catalog__books-list');


function setValue(elem, elemName, selector, prop, val) {
  elem.querySelector('.' + elemName + '__' + selector)[prop] = val;
}

function appendEl(container, el) {
  container.appendChild(el);
}

// открытие меню
function openMainNav(e) {
  e.preventDefault();
  const mainNav = document.querySelector('.main-nav');
  mainNav.classList.toggle('main-nav--open');
  burgerButton.classList.toggle('burger--close');
}
burgerButton.addEventListener('click', openMainNav);

// показ фильтра
function showFilters(e) {
  e.preventDefault();
  document.querySelector('.filters').classList.toggle('filters--open');
}
filtersButton.addEventListener('click', showFilters);

// отрисовка карточек
function renderCards() {
  booksArr.forEach(function(item, i) {
    let newCard = cardTemplate.content.cloneNode(true);
    setValue(newCard, 'card', 'inner', 'href', 'index.html#' + item.uri);
    setValue(newCard, 'card', 'img', 'src', 'img/' + item.uri + '.jpg');
    setValue(newCard, 'card', 'img', 'alt', item.name);
    setValue(newCard, 'card', 'title', 'textContent', item.name);
    setValue(newCard, 'card', 'price', 'textContent', item.price + ' ₽');
    newCard.querySelector('.card').setAttribute('id', i);
    appendEl(fragment, newCard);
  })
  appendEl(catalogBooksList, fragment);
}
renderCards();

function changeModalClasses() {
  document.querySelector('.modal').classList.toggle('modal--open');
  document.querySelector('html').classList.toggle('js-modal-open');
}

// создание попапа
function fillModal(item) {
  const newModal = modalTemplate.content.cloneNode(true);
  const modalClose = newModal.querySelector('.modal__close');
  const modalBuyBtn = newModal.querySelector('.btn--price');
  setValue(newModal, 'product', 'img', 'src', 'img/' + item.uri + '.jpg');
  setValue(newModal, 'product', 'img', 'alt', item.name);
  setValue(newModal, 'product', 'title', 'textContent', item.name);
  setValue(newModal, 'product', 'desc', 'textContent', item.desc);
  newModal.querySelector('.btn--price').firstChild.textContent = item.price + ' ₽';
  appendEl(fragment, newModal);
  appendEl(modalDialog, fragment);
  modalBuyBtn.addEventListener('click', addItem);
  modalClose.addEventListener('click', closePopup);
}

// закрытие попапа
function closePopup() {
  let modalContent = document.querySelector('.modal__content');
  let modalCloseBtn = modalContent.querySelector('.modal__close');
  modalCloseBtn.removeEventListener('click', closePopup);
  changeModalClasses();
  modalDialog.removeChild(modalContent);
}

// закрытие попапа по клику на пространство вне попапа
function closePopupByClickOnSpace(e)  {
  if(e.target !== modal) {
    return
  }
  closePopup();
};
modal.addEventListener('click', closePopupByClickOnSpace);

// // открытие попапа
function openPopup(e) {
  let target = e.currentTarget;
  let targetCard = e.target;
  if (targetCard.classList.contains('card__inner') || (targetCard.parentNode.classList.contains('card__inner'))) {
    fillModal(booksArr[target.id]);
    changeModalClasses();
  }
}

// обработчик клика по попапу и кнопке "купить"
function modalTrigger() {
  const articles = catalog.querySelectorAll('.card');
  let cardBuyBtns = catalog.querySelectorAll('.card__buy');
  for (var i = 0; i < articles.length; i++) {
    articles[i].addEventListener('click', openPopup);
    cardBuyBtns[i].addEventListener('click', addItem);
  }
}
modalTrigger();

// добавление товаров в корзину
function addItem() {
  let basketNumber = document.querySelector('.page-header__cart-num');
  let currentBasketNumber = parseInt(basketNumber.innerText);
  currentBasketNumber += 1;
  basketNumber.innerText = currentBasketNumber;
  // this.setAttribute('disabled', 'disabled');
}











  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  new Choices('.field-select:not(#lang) select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
  });
  // Кастомный селект выбора языка отдельно
  new Choices('#lang select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
    callbackOnCreateTemplates: function (template) {
      return {
        item: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
              ${getLangInSelectIcon(data.value)} ${data.label.substr(0,3)}
            </div>
          `);
        },
        choice: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
              ${getLangInSelectIcon(data.value)} ${data.label}
            </div>
          `);
        },
      };
    }
  });
  function getLangInSelectIcon(value) {
    if (value == 'ru') return '<span class="field-select__lang-ru"></span>';
    else if (value == 'en') return '<span class="field-select__lang-en"></span>';
    return '<span class="field-select__lang-null"></span>';
  }

  // Выбор диапазона цен
  var slider = document.getElementById('price-range');
  noUiSlider.create(slider, {
    start: [400, 1000],
    connect: true,
    step: 100,
    range: {
      'min': 200,
      'max': 2000
    }
  });

});

function ready (fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}