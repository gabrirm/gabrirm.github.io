'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const changeOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el != e.target) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

/////////////////////////////////////////

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',

  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////
//page navigation
//  document.querySelectorAll('.nav__link').forEach(el =>{
//   el.addEventListener('click', function(e){
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     const section = document.querySelector(id)
//     section.scrollIntoView({behavior: 'smooth'})
//   })
//  })

//event delegation

//1. add event listener to common parent element
//2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard clause!!
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //activate content area

  document
    .querySelectorAll('.operations__content--active')
    .forEach(cont => cont.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
//passing argument into handler
nav.addEventListener('mouseover', changeOpacity.bind(0.5));

nav.addEventListener('mouseout', changeOpacity.bind(1));

//Sticky navigation

// const sect1Coords = section1.getBoundingClientRect()
// window.addEventListener('scroll', function(e){
//   if (window.scrollY > sect1Coords.top) nav.classList.add('sticky')
//   else nav.classList.remove('sticky')
// })

//Sticky navigation: Intersection Observer API

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//revealing elements on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //another guard clause!!
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //unobserve to improve performance
  observer.unobserve(entry.target);
};
const allSections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.17,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgTargets = document.querySelectorAll('img[data-src');
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//slider

const slider = document.querySelector('.slider');

let curSlide = 0;
const slides = document.querySelectorAll('.slide');
const maxSlide = slides.length;

const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};


const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const init = function(){
  goToSlide(0);
  createDots()
  activateDots(0)
  
}
init()

//next slide

const nextSlide = function () {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;
  goToSlide(curSlide);
  activateDots(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;
  goToSlide(curSlide);
  activateDots(curSlide);
};
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics'
// message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
// const header = document.querySelector('.header');
// header.append(message);
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });
// message.style.backgroundColor = '#37382d';
// message.style.width = '120%';
// console.log(getComputedStyle(message));
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
// //attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src); //absolute URL
// console.log(logo.getAttribute('src')); //relative URL

const h1 = document.querySelector(`h1`);
console.log(h1.querySelector('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
