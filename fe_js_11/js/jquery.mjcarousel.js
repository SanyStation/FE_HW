(function($) {
  "use strict";

  var defaults = {
    buttonColor : '#000',
    animationSpeed : 500
  };

  $.fn.mjcarousel = function(params) {
    var options = $.extend(defaults, params);

    var leftArrow = this.find('.carousel__arrow--left');
    var rightArrow = this.find('.carousel__arrow--right');
    var elementsList = this.find('.carousel__list');

    leftArrow.css({'background-color' : options.buttonColor});
    rightArrow.css({'background-color' : options.buttonColor});

    var pixelsOffset = 200;
    var currentLeftValue = 0;
    var elementsCount = elementsList.find('li').length;
    var minimumOffset = - (elementsCount - 3) * pixelsOffset;
    var maximumOffset = 0;

    leftArrow.click(function() {
      if (currentLeftValue !== maximumOffset) {
        currentLeftValue += 200;
        elementsList.animate({ left : currentLeftValue + "px"}, options.animationSpeed);
      }
    });

    rightArrow.click(function() {
      if (currentLeftValue !== minimumOffset) {
        currentLeftValue -= 200;
        elementsList.animate({ left : currentLeftValue + "px"}, options.animationSpeed);
      }
    });

    return this;
  };
})(jQuery);