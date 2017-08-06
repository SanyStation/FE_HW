(function($) {
  "use strict";

  /**
   * Function is designed to draw menu by means of requestAnimationFrame.
   *
   * @param {XML|Node} menuObj - menu object which will be drown
   * @param {Function} drawFunction - function which draws the menu
   * @param {Number} duration - duration of animation in milliseconds
   */
  function drawMenu(menuObj, drawFunction, duration) {
    if (duration < 1) {
      duration = 1;
    }
    var start = performance.now();
    requestAnimationFrame(function animate(time) {
      var timePassed = time - start;
      if (timePassed > duration) {
        timePassed = duration;
      }

      drawFunction(menuObj, timePassed / duration);

      if (timePassed < duration) {
        requestAnimationFrame(animate);
      }
    });

  }

  /**
   * Function increases opacity of menu object in accordance with progress.
   *
   * @param {XML|Node} menuObj - menu object which will be drown
   * @param {Number} progress - real number from 0.0 to 1.0
   */
  function show(menuObj, progress) {
    if (progress > 0) {
      menuObj.css({
        'opacity' : progress
      });
    } else {
      menuObj.css({
        'display' : 'block',
        'opacity' : progress
      });
    }
  }

  /**
   * Function decreases opacity of menu object in accordance with progress.
   *
   * @param {XML|Node} menuObj - menu object which will be drown
   * @param {Number} progress - real number from 0.0 till 1.0
   */
  function hide(menuObj, progress) {
    if (progress < 1) {
      menuObj.css({
        'opacity' : 1 - progress
      });
    } else {
      menuObj.css({
        'display' : 'none'
      });
    }
  }

  $(function() {
    $('.menu-item__drop').hover(
      function() {
        var menu = $(this).children('.sub-menu');
        var red = Math.round(Math.random() * 255);
        window.console.log('red', red);
        menu.animate({
          'backgroundColor' : 'rgb(' + red + ', 75, 75)'
        }, 200);
        drawMenu(menu, show, 200);
      },
      function() {
        var menu = $(this).children('.sub-menu');
        menu.animate({
          'backgroundColor' : 'rgb(225, 75, 75)'
        }, 200);
        drawMenu(menu, hide, 200);
      }
    );
  });
})(jQuery);