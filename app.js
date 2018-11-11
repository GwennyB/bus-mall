'use strict';

function Product(prodName, imgSrc) {
  this.prodName = prodName;
  this.imgSrc = imgSrc;
  this.votes = 0;
  this.chartColor = 'rgba(randNum(0,255), randNum(0,255), randNum(0,255), randNum(0,1))';

  pageState.setColors();

  pageState.products.push(this);
}

var pageState = {
  filenames: ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'],
  products: [],
  mainEl: document.getElementById('main-content'),

  imagesAvailability: [], // holds display availability for choosing next 3 images
  imagesChosenLast: [0,0,0], // holds previous 3 choices
  imagesCurrent: [0,0,0],
  votesCount: 0,
  lastVote: 0,
  sessionResults: [],
  chartColors: [],

  setColors: function () {
    for (var i=0; i<pageState.products.length; i++) {
      this.chartColors[i] = 'rgba(' + randNum(0,255) + ',' + randNum(0,255) + ',' + randNum(0,255) +',' + randNum(0,1) + ')'
    }
  },

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
    for (var j=0; j<3; j++) { // 'last' is now 2 rounds old, so set its images to 'true'
      this.imagesAvailability[this.imagesChosenLast[j]] = true;
      this.imagesChosenLast[j] = this.imagesCurrent[j]; // push 'current' round to 'last' for next round
      this.imagesCurrent[j] = rollDice[j]; // push 'rolls' into 'current' for next round
      rollDice[j] = 0;
    }
  },

  resetVoting: function () {
    // this.imagesAvailability = [];
    for (var i=0; i<this.products.length; i++) {
      this.imagesAvailability[i] = true; // all options are available at first
    }
    for (var j=0; j<this.imagesChosenLast.length; j++) {
      this.imagesChosenLast[j] = 0; // will use to prevent duplication in next display
      this.imagesCurrent[j] = 0;
    }
  },

  createProducts: function () {
    // var productnames = [];  // IMPROVEMENT IN WORK - adding filename scraping
    for (var i = 0; i<this.filenames.length; i++) {
      new Product(this.filenames[i].split('.')[0],'img/'+this.filenames[i]);
    }
  }

};

function voted (event) {
  event.preventDefault();
  pageState.products[pageState.imagesChosenLast[pageState.lastVote]].votes++;
  pageState.votesCount++;
  pageState.nextImagesRandom();
  pageState.renderImages();
  if (pageState.votesCount >24) {
    endVoting();
  }
}

function refreshPage (event) {
  event.preventDefault;
  window.location.reload(true);
}

function endVoting () {
  var votedLeft = document.getElementById('imageleftcontainer');
  var votedCenter = document.getElementById('imagecentercontainer');
  var votedRight = document.getElementById('imagerightcontainer');
  votedLeft.removeEventListener('click', voted);
  votedCenter.removeEventListener('click', voted);
  votedRight.removeEventListener('click', voted);
  var buttonDivEl = document.getElementById('buttonhole');
  var buttonEl = document.createElement('button');
  buttonDivEl.appendChild(buttonEl);
  buttonEl.textContent = 'Click to reset';
  buttonEl.id = 'resetbutton';
  buildResultsArray(); // resultsArray[0] = names; [1] = votes
  sessionChart();
  historyChart();
  buttonEl.addEventListener('click', refreshPage);
}

function buildResultsArray () {
  var finalvotes = [];
  var productnames = [];
  for (var prodNum = 0; prodNum<pageState.products.length; prodNum++) {
    productnames[prodNum] = pageState.products[prodNum].prodName;
    finalvotes[prodNum] = pageState.products[prodNum].votes;
  }
  storage.updateLS();
  storage.retrieveLS();
  pageState.sessionResults = [productnames,finalvotes];
}

var storage = {
  resultsLSDEC: [],
  resultsLS: [],

  updateLS: function () {
    this.retrieveLS();
    var resultsLSDEC = storage.resultsLSDEC;
    var resultsLS = [];
    for (var i=0; i<resultsLSDEC.length; i++) {
      resultsLSDEC[i].votes += pageState.products[i].votes;
    }
    resultsLS = JSON.stringify(resultsLSDEC);
    localStorage.setItem('resultsLS',resultsLS);
    return resultsLSDEC;
  },

  retrieveLS: function () {
    if(localStorage.getItem('resultsLS')) {
      this.resultsLS = localStorage.getItem('resultsLS')
      this.resultsLSDEC = JSON.parse(this.resultsLS);
    } else {
      for (var i=0; i<pageState.products.length; i++) {
        this.resultsLSDEC[i] = {'name': pageState.products[i].prodName, 'votes': 0};
      }
      console.log('skeleton',this.resultsLSDEC);
    }
  }
};

function sessionChart () {
  var canvasEl = document.getElementById('votestally');
  new Chart (canvasEl,
    {
      type: 'bar',
      data:
        {
          labels: pageState.sessionResults[0],
          datasets:
            [
              {
                data: pageState.sessionResults[1],
                backgroundColor: 'rgba(15,80,160,0.5)',
              }
            ]
        },
      options: {
        title: {
          display: true,
          text: 'Your Vote Summary'
        }

      },
    }
  );
}

function historyChart () {
  var dataArray = [];
  var labelsArray = [];
  for (var i=0; i<storage.resultsLSDEC.length; i++) {
    dataArray[i] = storage.resultsLSDEC[i].votes;
    labelsArray[i] = storage.resultsLSDEC[i].name;
  }
  console.log(dataArray);
  var canvasEl = document.getElementById('historychart');
  new Chart (canvasEl,
    {
      type: 'horizontalBar',
      data:
        {
          labels: labelsArray,
          datasets:
          [
            {
              data: dataArray,
              backgroundColor: 'rgba(15,80,160,0.6)',
            }
          ]
        },
      options: {
        title: {
          display: true,
          text: 'Everyone\'s Vote Summary'
        }
      },
    }
  );
}

function randNum (low,high) {
  return Math.floor(Math.random()*(high-low+1) + low);
}

function runScript () {
  pageState.createProducts();
  pageState.resetVoting();
  pageState.nextImagesRandom();
  pageState.renderImages();
  storage.retrieveLS();
  historyChart();
  document.getElementById('imageleftcontainer').addEventListener('click', voted);
  document.getElementById('imagecentercontainer').addEventListener('click', voted);
  document.getElementById('imagerightcontainer').addEventListener('click', voted);
}

runScript();