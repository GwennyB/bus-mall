'use strict';

function Product(prodName, imgSrc, index) {
  this.prodName = prodName;
  this.imgSrc = imgSrc;
  this.votes = 0;

  products.push(this);
}

Product.prototype.render = function() {};

function createProducts () { // make loop to read folder contents and create name and path
  new Product('bag','img/bag.jpg');
  new Product('banana','img/banana.jpg');
  new Product('bathroom','img/bathroom.jpg');
  new Product('boots','img/boots.jpg');
  new Product('breakfast','img/breakfast.jpg');
  new Product('bubblegum','img/bubblegum.jpg');
  new Product('chair','img/chair.jpg');
  new Product('cthulhu','img/cthulhu.jpg');
  new Product('dog-duck','img/dog-duck.jpg');
  new Product('dragon','img/dragon.jpg');
  new Product('pen','img/pen.jpg');
  new Product('pet-sweep','img/pet-sweep.jpg');
  new Product('scissors','img/scissors.jpg');
  new Product('shark','img/shark.jpg');
  new Product('sweep','img/sweep.png');
  new Product('tauntaun','img/tauntaun.jpg');
  new Product('unicorn','img/unicorn.jpg');
  new Product('usb','img/usb.gif');
  new Product('water-can','img/water-can.jpg');
  new Product('wine-glass','img/wine-glass.jpg');
  new Product('chair','img/chair.jpg');
}

var tracker = {
  products: [],
  totalClicks: 0,
  mainEl: document.getElementById('main-content'),

  imagesAvailability: [], // holds display availability for choosing next 3 images
  imagesChosenLast: [0,0,0], // holds previous 3 choices
  imagesCurrent: [],

  getRandomIndex: function() {},

  getUniqueImages: function() {},

  renderImages: function() {
    document.getElementById('imageleft').src=products[this.imagesCurrent[0]].imgSrc;
    document.getElementById('imagecenter').src=products[this.imagesCurrent[1]].imgSrc;
    document.getElementById('imageright').src=products[this.imagesCurrent[2]].imgSrc;
  },

  addClickTracker: function() {
    // adds events to images once rendered
  },

  clickHandler: function(event) {},

  randomIndex: function () { // pass in tracker.imagesAvailability and .imagesChosenLast
    var rollDice = [];
    for (var i=0; i<3; i++) {
      rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      while (!this.imagesAvailability[rollDice[i]]) {
        rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      }
      this.imagesAvailability[rollDice[i]] = false;
      this.imagesCurrent[i] = rollDice[i];
    }
    for (var j=0; j<3; j++) {
      this.imagesAvailability[this.imagesChosenLast[j]] = true;
      this.imagesChosenLast[j] = rollDice[j];
      rollDice[j] = 0;
    }
  },

  resetVoting: function () {
    for (var i=0; i<products.length; i++) {
      this.imagesAvailability[i] = true; // all options are available at first
    }
    for (var j=0; j<this.imagesChosenLast.length; j++) {
      this.imagesChosenLast[j] = 0; // will use to prevent duplication in next display
    }
  }

};


// global here

var products = [];
createProducts();
tracker.resetVoting();
tracker.randomIndex();
tracker.renderImages();


// event listeners: voting
var votedLeft = document.getElementById('imageleft');
var votedCenter = document.getElementById('imagecenter');
var votedRight = document.getElementById('imageright');
votedLeft.addEventListener('click', votedLeft);
votedCenter.addEventListener('click', votedCenter);
votedRight.addEventListener('click', votedRight);