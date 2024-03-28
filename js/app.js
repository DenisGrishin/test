/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  var __webpack_exports__ = {}; // CONCATENATED MODULE: ./src/js/files/functions.js

  function isWebp() {
    // Проверка поддержки webp
    function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    // Добавление класса _webp или _no-webp для HTML
    testWebP(function (support) {
      let className = support === true ? "webp" : "no-webp";
      document.documentElement.classList.add(className);
    });
  }

  // Вспомогательные модули плавного расскрытия и закрытия объекта в этом слчае для спойлера(Аркадеон) ======================================================================================================================================================================
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
            _slideToggle(spollerTitle.nextElementSibling, 300);
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
          _slideUp(spollerActiveTitle.nextElementSibling, 300);
        }
      }
    }
  } // CONCATENATED MODULE: ./src/js/files/sliders.js

  //================================================================================================================================================================================================================================================================================================================

  function bildSliders() {
    //BildSlider
    let sliders = document.querySelectorAll(
      '[class*="__swiper"]:not(.swiper-wrapper)',
    );
    if (sliders) {
      sliders.forEach((slider) => {
        slider.parentElement.classList.add("swiper");
        slider.classList.add("swiper-wrapper");
        for (const slide of slider.children) {
          slide.classList.add("swiper-slide");
        }
      });
    }
  }
  // Инициализация слайдеров
  function initSliders() {
    // Добавление классов слайдера
    // при необходимости отключить
    bildSliders();

    // Перечень слайдеров
    if (document.querySelector(".we-doing__slider")) {
      new Swiper(".we-doing__slider", {
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 25,
        autoHeight: false,
        speed: 800,
        // Arrows
        navigation: {
          nextEl: ".slider-navigation .slider-navigation-next",
          prevEl: ".slider-navigation .slider-navigation-prev",
        },

        breakpoints: {
          320: {
            slidesPerView: 1.3,
            spaceBetween: 15,
          },
          429.98: { slidesPerView: 1.3 },

          767.98: {
            slidesPerView: 2.3,
            spaceBetween: 15,
          },
          1023.98: { slidesPerView: 3, spaceBetween: 20 },
          1439.98: {
            spaceBetween: 24,
          },
        },

        on: {},
      });
    }
    if (document.querySelector(".so-discount__slider")) {
      new Swiper(".so-discount__slider", {
        observer: true,
        observeParents: true,
        slidesPerView: 3,
        spaceBetween: 30,
        autoHeight: false,
        speed: 800,
        pagination: {
          el: ".so-discount__pagging",
          clickable: true,
        },

        breakpoints: {
          320.98: {
            slidesPerView: 1.1,
            spaceBetween: 30,
          },
          429.98: { slidesPerView: 1.28 },

          767.98: {
            slidesPerView: 2.25,
            spaceBetween: 30,
          },
          1023.98: { slidesPerView: 3 },
        },

        on: {},
      });
    }
    if (document.querySelector(".banner-gallery__slider")) {
      new Swiper(".banner-gallery__slider", {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: false,
        speed: 800,
        pagination: {
          el: ".banner-gallery__pagination",
          clickable: true,
        },

        breakpoints: {},

        on: {},
      });
    }
    if (document.querySelector(".banner-gallery__slider")) {
      new Swiper(".banner-gallery__slider", {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: false,
        speed: 800,
        pagination: {
          el: ".banner-gallery__pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".banner-gallery__navigation .banner-gallery__btn_prev",
          prevEl: ".banner-gallery__navigation .banner-gallery__btn_next",
        },
        breakpoints: {},
        on: {},
      });
    }
  }
  // Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
  function initSlidersScroll() {
    // Добавление классов слайдера
    // при необходимости отключить
    bildSliders();
  }

  window.addEventListener("load", function (e) {
    // Запуск инициализации слайдеров
    initSliders();
  }); // CONCATENATED MODULE: ./src/js/files/script.js

  /* маска на инупт */
  $.mask.definitions["N"] = "[/0-6|9/]";

  $(".phone_mask")
    .click(function () {
      $(this).setCursorPosition(2);
    })
    .mask("+7 N99 999-99-99");

  $.fn.setCursorPosition = function (pos) {
    if (
      $(this).get(0).setSelectionRange &&
      $(this).val().replace(/\D/g, "").length != 11
    ) {
      $(this).get(0).setSelectionRange(pos, pos);
    }
  };
  /* инициализация карты */
  function initMap() {
    var myMap = new ymaps.Map(
      "map",
      {
        center: [55.73, 37.6],
        zoom: 8,
      },
      {
        searchControlProvider: "yandex#search",
      },
    );
    myMap.controls.remove("geolocationControl"); // удаляем геолокацию
    myMap.controls.remove("searchControl"); // удаляем поиск
    myMap.controls.remove("trafficControl"); // удаляем контроль трафика
    myMap.controls.remove("typeSelector"); // удаляем тип
    myMap.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
    myMap.controls.remove("zoomControl"); // удаляем контрол зуммирования
    myMap.controls.remove("rulerControl"); // удаляем контрол правил
    myMap.behaviors.disable(["scrollZoom"]); // отключаем скролл карты (опционально)

    myMap.geoObjects.add(new ymaps.Placemark([55.73, 37.6], {}));
    let myPolygon = new ymaps.Polygon(
      [
        [
          [54.80831947994278, 38.18433433925412],
          [54.87945876925923, 38.52995859405644],
          [55.122011885673516, 38.67767483903884],
          [55.37773639221365, 38.95005546337981],
          [55.69101620830514, 39.06854923170738],
          [55.962220037403114, 39.09331426601756],
          [56.118493229997256, 38.83962697728742],
          [56.38328535103986, 38.538312268742686],
          [56.72694946754399, 38.84094055277811],
          [56.54218234666476, 37.45911829335503],
          [56.484269925944716, 36.55340126947627],
          [56.082994973012944, 35.26044765213379],
          [55.528582146509564, 35.79574540554199],
          [54.886906159423376, 36.2751232506904],
          [54.80831947994278, 38.18433433925412],
        ],
      ],
      {
        hintContent: "Многоугольник",
      },
      {
        fillColor: "#009CD9",
        strokeWidth: 1,
        strokeColor: "#0067A0",
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
    );

    myMap.geoObjects.add(myPolygon);
  }
  ymaps.ready(initMap);
  // ======================

  function initQwiz() {
    const checkBlock = document.querySelector(".form-qwiz");
    const inputChecks = document.querySelectorAll(".form-qwiz__input");
    const steps = document.querySelectorAll(".form-qwiz__step");
    const prevBtn = document.querySelector(".qwiz-section__prev-btn");
    const nextBtn = document.querySelector(".qwiz-section__next-btn");
    const panelNavigate = document.querySelector(".qwiz-section__bottom");
    const stepCurrentNumber = document.querySelector(
      ".qwiz-section__current-step",
    );
    const restartBtn = document.querySelector(".form-qwiz__restart-btn");
    const submitBtn = document.querySelector(".form-qwiz__btn");
    let currentStep = 0;
    let isCheck = false;

    nextBtn.addEventListener("click", nextStep);
    prevBtn.addEventListener("click", prevStep);
    checkBlock.addEventListener("click", isClickCheck);
    // кнопка submit для теста, сделано для просмтора финальной страницы
    submitBtn.addEventListener("click", function (e) {
      nextStep();
    });

    // кнопка заказать занова
    restartBtn.addEventListener("click", function (e) {
      currentStep = 0;
      isCheck = false;
      stepCurrentNumber.innerHTML = 1;
      prevBtn.classList.add("_disabled");
      prevBtn.disabled = true;
      steps[0].classList.add("_current");
      steps[steps.length - 1].classList.remove("_current");
      panelNavigate.style.display = "flex";
      stepCurrentNumber.parentNode.style.display = "flex";
      stepCurrentNumber.parentNode.classList.remove("_ready");
      inputChecks.forEach((inpt) => (inpt.checked = false));
    });

    function isClickCheck(e) {
      let target = e.target;
      if (target.classList.contains("form-qwiz__input")) {
        isValidateFormService();

        if (!isCheck && currentStep === steps.length - 3) {
          nextBtn.classList.add("_disabled");
          nextBtn.disabled = true;
        }
        if (isCheck) {
          nextBtn.classList.remove("_disabled");
          nextBtn.disabled = false;
        }
      }
    }
    // ==============================================================================

    // шаг вперед
    function nextStep(e) {
      ++currentStep;

      if (isCheck && currentStep === steps.length - 2) {
        stepCurrentNumber.parentNode.classList.add("_ready");
      }

      if (!isCheck && currentStep === steps.length - 3) {
        nextBtn.classList.add("_disabled");
        nextBtn.disabled = true;
      }
      if (steps.length - 1 === currentStep) {
        stepCurrentNumber.parentNode.style.display = "none";
      }

      if (steps.length - 2 === currentStep) {
        panelNavigate.style.display = "none";
      }

      if (steps.length === currentStep) {
        steps[currentStep - 1].style.display = "none";
        return;
      }

      stepCurrentNumber.innerHTML = currentStep + 1;

      prevBtn.classList.remove("_disabled");
      prevBtn.disabled = false;
      steps[currentStep - 1].classList.remove("_current");
      steps[currentStep].classList.add("_current");
    }
    // шаг назад
    function prevStep(e) {
      if (currentStep === steps.length - 2) {
        stepCurrentNumber.parentNode.classList.remove("_ready");
      }

      if (currentStep === steps.length - 3) {
        nextBtn.classList.remove("_disabled");
        prevBtn.disabled = true;
      }

      if (prevBtn.classList.contains("_disabled")) {
        return;
      }
      currentStep--;
      stepCurrentNumber.innerHTML = currentStep + 1;

      if (currentStep === 0) {
        prevBtn.classList.add("_disabled");
      }
      nextBtn.disabled = false;
      steps[currentStep + 1].classList.remove("_current");
      steps[currentStep].classList.add("_current");
    }

    // валидация чекбокса
    function isValidateFormService() {
      for (let i = 0; i < inputChecks.length; i++) {
        const element = inputChecks[i];
        if (element.checked) {
          isCheck = true;
          return;
        }
      }
      isCheck = false;
      return;
    }
  }
  initQwiz();

  const spollerOrderBtns = document.querySelectorAll(".spollers__btn-order");
  spollerOrderBtns.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }); // CONCATENATED MODULE: ./src/js/app.js

  // Основные модули ========================================================================================================================================================================================================================================================

  isWebp();

  spollers();

  //============================================================================================================================================================================================================================================

  /******/
})();
