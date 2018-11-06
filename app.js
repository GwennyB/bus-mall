'use strict';

function Product(prodName, imgSrc) {
  this.prodName = prodName;
  this.imgSrc = imgSrc;
  this.votes = 0;

  tracker.products.push(this);
}

function createProducts (filenames) { // make loop to read folder contents and create name and path
  // var productnames = [];  // IMPROVEMENT IN WORK - adding filename scraping
  for (var prodNum = 0; prodNum<filenames.length; prodNum++) {
    new Product(filenames[prodNum].split('.')[0],'img/'+filenames[prodNum]);
  }
}

var tracker = {
  products: [],
  mainEl: document.getElementById('main-content'),

  imagesAvailability: [], // holds display availability for choosing next 3 images
  imagesChosenLast: [0,0,0], // holds previous 3 choices
  imagesCurrent: [0,0,0],
  votesCount: 0,
  lastVote: 0,

  renderImages: function() {
    document.getElementById('imageleft').src=this.products[this.imagesCurrent[0]].imgSrc;
    document.getElementById('imagecenter').src=this.products[this.imagesCurrent[1]].imgSrc;
    document.getElementById('imageright').src=this.products[this.imagesCurrent[2]].imgSrc;
  },

  nextImagesRandom: function () {
    var rollDice = [];
    for (var i=0; i<3; i++) { // get 3 images that are marked 'true'
      rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      while (!this.imagesAvailability[rollDice[i]]) { // keep rolling until rolled image is 'true'
        rollDice[i] = Math.floor(Math.random()*this.imagesAvailability.length);
      }
      this.imagesAvailability[rollDice[i]] = false; // set this selection from 'true' to 'false'
    }
    console.log('avail',this.imagesAvailability);
    console.log('rollDice',rollDice);
    for (var j=0; j<3; j++) { // 'last' is now 2 rounds old, so set its images to 'true'
      this.imagesAvailability[this.imagesChosenLast[j]] = true;
      this.imagesChosenLast[j] = this.imagesCurrent[j]; // push 'current' round to 'last' for next round
      this.imagesCurrent[j] = rollDice[j]; // push 'rolls' into 'current' for next round
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
  makeChart();
  tracker.nextImagesRandom();
  tracker.renderImages();
  if (tracker.votesCount === 25) {
    endVoting();
  }
}

function refreshPage (event) {
  event.preventDefault;
  window.location.reload(true);
}

function endVoting () {
  var votedLeft = document.getElementById('imageleft');
  var votedCenter = document.getElementById('imagecenter');
  var votedRight = document.getElementById('imageright');
  votedLeft.removeEventListener('click', voted);
  votedCenter.removeEventListener('click', voted);
  votedRight.removeEventListener('click', voted);

  var buttonDivEl = document.getElementById('resultsbutton'); // make reset button
  var buttonEl = document.getElementById('newbutton');
  buttonEl = document.createElement('button');
  buttonDivEl.appendChild(buttonEl);
  buttonEl.textContent = 'Click to reset';
  buttonEl.addEventListener('click', refreshPage);
}

function makeChart () {
  var resultsArray = buildResultsArray(); // resultsArray[0] = names; [1] = votes
  var canvasEl = document.getElementById('votestally');
  // build chart
  new Chart (canvasEl,
    {
      type: 'radar',
      data:
        {
          labels: resultsArray[0],
          datasets:
          [
            {
              data: resultsArray[1],
            }
          ]
        },
      options: [],
    }
  );

}

function buildResultsArray () {
  var finalvotes = [];
  var productnames = [];
  for (var prodNum = 0; prodNum<tracker.products.length; prodNum++) {
    productnames[prodNum] = tracker.products[prodNum].prodName;
    finalvotes[prodNum] = tracker.products[prodNum].votes;
  }
  return [productnames, finalvotes];
}

function runScript () {
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