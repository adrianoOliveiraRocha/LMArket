const Category = require("../app/models/Category");

const Pagination = (function() {

  function Pagination() {
    this.size = 6; // how much products per page?
    this.leftSize = 2;
    this.rightSize = 2;
  }

  Pagination.prototype.getLeftSide = function(pageNumber) {
    var init = pageNumber - this.leftSize;
    var leftButtons = [];

    for(let i = init; i < pageNumber; i++) {
      if(i > 0) leftButtons.push(i);
    }

    var response = {
      explode: init > 1 ? true : false,
      leftButtons
    };

    return response;
  }

  Pagination.prototype.getRightSide = function(pageNumber, numberOfPages) {
    var init = parseInt(pageNumber) + 1;
    var rightButtons = [];

    for(let i = init; i <= (parseFloat(pageNumber) + this.rightSize); i++) {
      if(i <= numberOfPages) rightButtons.push(i);
    }
    
    var response = {
      explode: parseInt(pageNumber) + this.rightSize >= parseInt(numberOfPages) ? false : true,
      rightButtons
    };
    
    return response;
  }

  Pagination.prototype.getNumberOfPages = function(totalOfProducts) {
    return Math.ceil(totalOfProducts / this.size);
  }

  Pagination.prototype.sendCategory = function(categoryId) {
    return categoryId ? `&categoryId=${categoryId}` : null;
  }

  return Pagination;

})();

module.exports = Pagination;