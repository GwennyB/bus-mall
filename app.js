'use strict';

function Product(prodName, imgSrc) {
  this.prodName = prodName;
  this.imgSrc = imgSrc;
  this.votes = 0;

  tracker.products.push(this);
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
  mainEl: document.getElementById('main-content'),

  imagesAvailability: [], // holds display availability for choosing next 3 images
  imagesChosenLast: [0,0,0], // holds previous 3 choices
  votesCount: 0,
  lastVote: 0,

  renderImages: function() {
    document.getElementById('imageleft').src=this.products[this.imagesChosenLast[0]].imgSrc;
    document.getElementById('imagecenter').src=this.products[this.imagesChosenLast[1]].imgSrc;
    document.getElementById('imageright').src=this.products[this.imagesChosenLast[2]].imgSrc;
  },

  nextImagesRandom: function () { // pass in tracker.imagesAvailability and .imagesChosenLast
    var rollDice = [];
    for (var i=0; i<3; i++) {
      rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      while (!this.imagesAvailability[rollDice[i]]) {
        rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      }
      this.imagesAvailability[rollDice[i]] = false;
      this.imagesChosenLast[i] = rollDice[i];
    }
    for (var j=0; j<3; j++) {
      this.imagesAvailability[this.imagesChosenLast[j]] = true;
      this.imagesChosenLast[j] = rollDice[j];
      rollDice[j] = 0;
    }
  },

  resetVoting: function () {
    this.imagesAvailability = [];
    for (var i=0; i<tracker.products.length; i++) {
      this.imagesAvailability[i] = true; // all options are available at first
    }
    for (var j=0; j<tracker.imagesChosenLast.length; j++) {
      tracker.imagesChosenLast[j] = 0; // will use to prevent duplication in next display
    }
  }

};

function voted (event) {
  event.preventDefault();
  tracker.products[tracker.imagesChosenLast[tracker.lastVote]].votes++;
  tracker.votesCount++;
  tracker.nextImagesRandom();
  tracker.renderImages();
  console.log('votesCount',tracker.votesCount);
  if (tracker.votesCount === 25) {
    resultsCall();
  }
}

function renderResults () {
  var ulEl = document.getElementById('resultslist');
  for (var list=0; list<tracker.products.length; list++) {
    var liEl = document.createElement('li');
    liEl.textContent = tracker.products[list].prodName + ': ' + tracker.products[list].votes + ' votes';
    ulEl.appendChild(liEl);
  }
  var buttonDivEl = document.getElementById('resultsbutton');
  var buttonEl = document.getElementById('newbutton');
  buttonDivEl.removeChild(buttonEl);
  buttonEl = document.createElement('button');
  buttonDivEl.appendChild(buttonEl);
  buttonEl.textContent = 'Click to reset';
  buttonEl.addEventListener('click', refreshPage);
}

function refreshPage (event) {
  event.preventDefault;
  window.location.reload(true);
}

function resultsCall () {
  var votedLeft = document.getElementById('imageleft');
  var votedCenter = document.getElementById('imagecenter');
  var votedRight = document.getElementById('imageright');
  votedLeft.removeEventListener('click', voted);
  votedCenter.removeEventListener('click', voted);
  votedRight.removeEventListener('click', voted);
  var buttonDivEl = document.getElementById('resultsbutton');
  var buttonEl = document.createElement('button');
  buttonEl.id = 'newbutton';
  buttonDivEl.appendChild(buttonEl);
  buttonEl.textContent = 'Click for results';
  buttonEl.addEventListener('click', renderResults);
}


function runScript () {
  createProducts();
  tracker.resetVoting();
  tracker.nextImagesRandom();
  tracker.renderImages();
  var votedLeft = document.getElementById('imageleft');
  var votedCenter = document.getElementById('imagecenter');
  var votedRight = document.getElementById('imageright');
  votedLeft.addEventListener('click', voted);
  votedCenter.addEventListener('click', voted);
  votedRight.addEventListener('click', voted);
}

runScript();