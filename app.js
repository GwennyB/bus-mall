'use strict';

function Product(prodName, imgSrc) {
  this.prodName = prodName;
  this.imgSrc = imgSrc;
  this.votes = 0;

  tracker.products.push(this);
}

Product.prototype.render = function() {};

// function getFilenames () {
//   var inp = document.getElementById('get-files');
//   var filenames = [];
//   var productnames = [];
//   inp.addEventListener('input', scrapenames);
//   function scrapenames (event) {
//     event.preventDefault;
//     for (var i=0; i<inp.files.length; i++) {
//       filenames.push(inp.files[i].name);
//       productnames.push(inp.files[i].name.split('.')[0]);
//     }
//   }
//   return [productnames, filenames];
// }

function createProducts (filenames) { // make loop to read folder contents and create name and path
  // var productnames = [];
  for (var prodNum = 0; prodNum<filenames.length; prodNum++) {
    new Product(filenames[prodNum].split('.')[0],'img/'+filenames[prodNum]);
  }
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
  // var imagesList = getFilenames();
  var filenames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
  createProducts(filenames);
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