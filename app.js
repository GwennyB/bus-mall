'use strict';

var products = [];
function Product(name, src) {
  this.name = name;
  this.src = src;
  this.votes = 0;
}

var tracker = {
  products: [],
  totalClicks: 0,
  mainEl: document.getElementById('main-content'),

  getRandomIndex: function() {},

  getUniqueImages: function() {},

  renderImages: function() {},

  addClickTracker: function() {
    // adds events to images once rendered
  },

  clickHandler: function(event) {},

};

function createProducts () {}

