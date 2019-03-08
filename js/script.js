ready(function(){

  // В этом месте должен быть написан ваш код

// открытие меню
function openMainNav() {
const burgerButton = document.querySelector('.burger');
function burgerTrigger(e) {
  e.preventDefault();
  const mainNav = document.querySelector('.main-nav');
  mainNav.classList.toggle('main-nav--open');
  burgerButton.classList.toggle('burger--close');
}
burgerButton.addEventListener('click', burgerTrigger);
}

// показ фильтра
function showFilters() {
const filtersButton = document.querySelector('.filters__trigger');
function filterTrigger(e) {
  e.preventDefault();
  document.querySelector('.filters').classList.toggle('filters--open');
}
filtersButton.addEventListener('click', filterTrigger);
}

// отрисовка карточек
function renderCards() {
  let fragment = document.createDocumentFragment();
  const catalogBooksList = document.querySelector('.catalog__books-list');
  const cardTemplate = document.querySelector('#card__template');
  let booksArr = books.splice(0, 12);

  function setValue(elem, selector, prop, val) {
    elem.querySelector('.card__' + selector)[prop] = val;
  }

  function appendEl(container, el) {
    container.appendChild(el);
  };

  booksArr.forEach(function(item, i) {
    const newCard = cardTemplate.content.cloneNode(true);
    setValue(newCard, 'inner', 'href', 'index.html#' + item.uri);
    setValue(newCard, 'img', 'src', 'img/' + item.uri + '.jpg');
    setValue(newCard, 'img', 'alt', item.name);
    setValue(newCard, 'title', 'textContent', item.name);
    setValue(newCard, 'price', 'textContent', item.price + ' ₽');

    appendEl(fragment, newCard);
  })
  appendEl(catalogBooksList, fragment);

  function setCardId() {
    const cardList = document.querySelector('.catalog__books-list').querySelectorAll('.card');

    for (var i = 0; i < cardList.length; i++) {
      const card = cardList[i];
      card.setAttribute('id', i);
    }
  }
  setCardId();
}



function createModal() {
  const modalDialog = document.querySelector('.modal__dialog');
  const modalTemplate = document.querySelector('#modal__template');
  const newModal = modalTemplate.content.cloneNode(true);

  let booksArr = books.splice(0, 12);

  function setValue(elem, selector, prop, val) {
    elem.querySelector('.product__' + selector)[prop] = val;
  }

  booksArr.forEach(function(item, i) {
    setValue(newModal, 'img', 'src', 'img/' + item.uri + '.jpg');
    setValue(newModal, 'img', 'alt', item.name);
    setValue(newModal, 'title', 'textContent', item.name);
    setValue(newModal, 'desc', 'textContent', item.desc);
    newModal.querySelector('.btn--price').firstChild.textContent = item.price + ' ₽';
  })

  modalDialog.appendChild(newModal);
  return newModal;
};


function openModal() {
  createModal()
  document.querySelector('.modal').classList.add('modal--open');
  document.querySelector('html').classList.add('js-modal-open');
}

renderCards();
openMainNav();
showFilters();



for (var i = 0; i < 12; i++) {
  let article = document.getElementById(i);
  article.addEventListener('click', openModal);
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
