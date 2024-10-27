/******/ (() => {
  // webpackBootstrap
  /******/ "use strict"; // ./src/js/files/functions.js

  // Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
  let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = !showmore ? true : false;
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
      }, duration);
    }
  };
  let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.hidden = target.hidden ? false : null;
      showmore ? target.style.removeProperty("height") : null;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
      }, duration);
    }
  };
  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  };
  // Вспомогательные модули блокировки прокрутки и скочка ====================================================================================================================================================================================================================================================================================

  // Модуль работы со спойлерами =======================================================================================================================================================================================================================
  /*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.

Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/
  function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
      // Получение обычных слойлеров
      const spollersRegular = Array.from(spollersArray).filter(
        function (item, index, self) {
          return !item.dataset.spollers.split(",")[0];
        },
      );
      // Инициализация обычных слойлеров
      if (spollersRegular.length) {
        initSpollers(spollersRegular);
      }
      // Получение слойлеров с медиа запросами
      let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach((mdQueriesItem) => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      }

      // Инициализация
      function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach((spollersBlock) => {
          spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
          if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add("_spoller-init");
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
          } else {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        });
      }
      // Работа с контентом
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
        if (spollerTitles.length > 0) {
          spollerTitles.forEach((spollerTitle) => {
            if (hideSpollerBody) {
              spollerTitle.removeAttribute("tabindex");
              if (!spollerTitle.classList.contains("_spoller-active")) {
                spollerTitle.nextElementSibling.hidden = true;
              }
            } else {
              spollerTitle.setAttribute("tabindex", "-1");
              spollerTitle.nextElementSibling.hidden = false;
            }
          });
        }
      }
      function setSpollerAction(e) {
        const el = e.target;
        if (el.closest("[data-spoller]")) {
          const spollerTitle = el.closest("[data-spoller]");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller")
            ? true
            : false;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (
              oneSpoller &&
              !spollerTitle.classList.contains("_spoller-active")
            ) {
              hideSpollersBody(spollersBlock);
            }
            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, 500);
          }
          e.preventDefault();
        }
      }
      function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector(
          "[data-spoller]._spoller-active",
        );
        if (spollerActiveTitle) {
          spollerActiveTitle.classList.remove("_spoller-active");
          _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
      }
    }
  }

  // Уникализация массива
  function uniqArray(array) {
    return array.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });
  }

  // Обработа медиа запросов из атрибутов
  function dataMediaQueries(array, dataSetValue) {
    // Получение объектов с медиа запросами
    const media = Array.from(array).filter(function (item, index, self) {
      if (item.dataset[dataSetValue]) {
        return item.dataset[dataSetValue].split(",")[0];
      }
    });
    // Инициализация объектов с медиа запросами
    if (media.length) {
      const breakpointsArray = [];
      media.forEach((item) => {
        const params = item.dataset[dataSetValue];
        const breakpoint = {};
        const paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });
      // Получаем уникальные брейкпоинты
      let mdQueries = breakpointsArray.map(function (item) {
        return (
          "(" +
          item.type +
          "-width: " +
          item.value +
          "px)," +
          item.value +
          "," +
          item.type
        );
      });
      mdQueries = uniqArray(mdQueries);
      const mdQueriesArray = [];

      if (mdQueries.length) {
        // Работаем с каждым брейкпоинтом
        mdQueries.forEach((breakpoint) => {
          const paramsArray = breakpoint.split(",");
          const mediaBreakpoint = paramsArray[1];
          const mediaType = paramsArray[2];
          const matchMedia = window.matchMedia(paramsArray[0]);
          // Объекты с нужными условиями
          const itemsArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
              return true;
            }
          });
          mdQueriesArray.push({
            itemsArray,
            matchMedia,
          });
        });
        return mdQueriesArray;
      }
    }
  } // ./src/js/files/scroll/scroll.js
  //================================================================================================================================================================================================================================================================================================================

  // Переменная контроля добавления события window scroll.
  let addWindowScrollEvent = false;
  //====================================================================================================================================================================================================================================================================================================

  // Работа с шапкой при скроле
  function headerScroll() {
    addWindowScrollEvent = true;
    const header = document.querySelector("header.header");
    const headerShow = header.hasAttribute("data-scroll-show"); // Добавить
    const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
    let scrollDirection = 0;
    document.addEventListener("windowScroll", function (e) {
      const scrollTop = window.scrollY;

      if (scrollTop >= startPoint) {
        !header.classList.contains("_header-scroll")
          ? header.classList.add("_header-scroll")
          : null;
        if (headerShow) {
          if (scrollTop > scrollDirection) {
            // downscroll code
            header.classList.contains("_header-show")
              ? header.classList.remove("_header-show")
              : null;
          } else {
            // upscroll code

            !header.classList.contains("_header-show")
              ? header.classList.add("_header-show")
              : null;
          }
        }
      } else {
        header.classList.contains("_header-scroll")
          ? header.classList.remove("_header-scroll")
          : null;
        if (headerShow) {
          header.classList.contains("_header-show")
            ? header.classList.remove("_header-show")
            : null;
        }
      }
      scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  // При подключении модуля обработчик события запустится автоматически
  setTimeout(() => {
    if (addWindowScrollEvent) {
      let windowScroll = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(windowScroll);
      });
    }
  }, 0); // ./src/js/files/script.js

  document.addEventListener("DOMContentLoaded", () => {
    // form отправка
    function sendEmail(params) {
      const forms = document.querySelectorAll("form");
      const finishForm = document.querySelector(".finish-form");

      if (forms !== 0) {
        forms.forEach((form) => {
          const wrapperInput = form.querySelector(".block-input");
          const input = form.querySelector(".block-input__email-input");
          const checkbox = form.querySelector(".checkbox__input");
          const labelСheckbox = form.querySelector(".checkbox__label");

          input.addEventListener("input", (e) => {
            let value = e.target.value;

            deletStateValidate(wrapperInput);

            if (value && validateEmail(value)) {
              wrapperInput.classList.add("_correct");
            }
          });

          // событие если есть чекбокс в форме
          if (checkbox) {
            checkbox.addEventListener("change", () => {
              if (!checkbox.checked) {
                return;
              }
              deletStateValidate(wrapperInput);
              wrapperInput.classList.add("_correct");
              labelСheckbox.classList.remove("_error");
            });
          }

          form.addEventListener("submit", function (e) {
            e.preventDefault();

            // валидация на пустое поле и почту
            if (!validateEmail(input.value)) {
              createElementText(
                wrapperInput,
                "block-input__text-error",
                "Formato de email inválido,<br> verifique a ortografia",
              );
              return;
            }
            // валидация на чекбокс
            if (checkbox && !checkbox.checked) {
              labelСheckbox.classList.add("_error");

              createElementText(
                wrapperInput,
                "block-input__text-error",
                "Требуется ваше согласие<br> на обработку данных",
              );
              return;
            }

            //тут должен быть какой-то поромис, и если он срабатывает, покзываем блок финишь, а если нет то показываем ошибку............
            if (wrapperInput) {
              let isClassCheckbox = checkbox
                ? "finish-form"
                : "finish-form_no-chckBox";

              form.style.display = "none";
              createElementText(
                wrapperInput.parentElement.parentElement,
                isClassCheckbox,
                "Fantástico! Espera<br> La primera carta",
              );
            }
          });
        });
      }

      // создание текст с ошибкой и финиша
      function createElementText(seletor, classStyle, text) {
        deletStateValidate(seletor);

        seletor.insertAdjacentHTML(
          "beforeend",
          `<div class="${classStyle}">${text}</div>`,
        );
        seletor.classList.add("_error");
      }

      // валидация почты возвращает true / false
      function validateEmail(email) {
        const regExtEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
        return regExtEmail.test(email);
      }

      // удаляет классы состояния, и блок текста ошибки  если он есть
      function deletStateValidate(wrapperInput) {
        const textError = document.querySelector(".block-input__text-error");

        textError ? textError.remove() : "";
        wrapperInput.classList.remove("_error");
        wrapperInput.classList.remove("_correct");
      }
    }

    sendEmail();
  }); // ./src/js/app.js

  // Подключение основного файла стилей

  // Основные модули ========================================================================================================================================================================================================================================================

  /*
Модуль работы со спойлерами
*/
  spollers();

  // Функции работы скроллом ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Функционал добавления классов к хедеру при прокрутке
  headerScroll();

  // Прочее ========================================================================================================================================================================================================================================================
  /* Подключаем файлы со своим кодом */

  //============================================================================================================================================================================================================================================

  /******/
})();
