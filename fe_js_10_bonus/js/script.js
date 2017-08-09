/**
 * Function is designed to draw menu by means of requestAnimationFrame.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Function} drawFunction - function which draws the menu
 * @param {Number} duration - duration of animation in milliseconds
 * @param {String} oldColor - represents string in rgb format (e.g. 'rgb(255, 10, 25)')
 * @param {Function} colorFunction - function to generate new color
 */
function drawMenu(menuObj, drawFunction, duration, oldColor, colorFunction) {
  "use strict";
  if (duration < 1) {
    duration = 1;
  }

  var newColor = colorFunction();
  var parsedOldColor = parseColor(oldColor);
  var parsedNewColor = parseColor(newColor);
  var colorValue = [parsedNewColor[0] - parsedOldColor[0], parsedNewColor[1] - parsedOldColor[1], parsedNewColor[2] - parsedOldColor[2]];

  var start = performance.now();
  requestAnimationFrame(function animate(time) {
    var timePassed = time - start;
    if (timePassed > duration) {
      timePassed = duration;
    }

    drawFunction(menuObj, timePassed / duration, parsedOldColor, colorValue);

    if (timePassed < duration) {
      requestAnimationFrame(animate);
    }
  });
}

/**
 * Function is created to parse text format of color to number format.
 * Available formats:
 * 1. Short hex format (3 symbols, e.g. #fab)
 * 2. Full hex format (6 symbols, e.g. #ffaabb)
 * 3. RGB format (e.g. rgb(255, 17, 48))
 *
 * @param {String} color - text format of color
 * @returns {Array.<Number>} integer format of incoming color
 */
function parseColor(color) {
  "use strict";

  //Short hex format (3 symbols, e.g. #fab)
  var colorValue = color.match(/^#([0-9a-f]{3})$/i);
  if (colorValue) {
    return [
      parseInt(colorValue.charAt(0), 16) * 0x11,
      parseInt(colorValue.charAt(1), 16) * 0x11,
      parseInt(colorValue.charAt(2), 16) * 0x11
    ];
  }

  //Full hex format (6 symbols, e.g. #ffaabb)
  colorValue = color.match(/^#([0-9a-f]{6})$/i);
  if (colorValue) {
    return [
      parseInt(colorValue.substr(0, 2), 16),
      parseInt(colorValue.substr(2, 2), 16),
      parseInt(colorValue.substr(4, 2), 16)
    ];
  }

  //RGB format
  colorValue = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (colorValue) {
    return [parseInt(colorValue[1]), parseInt(colorValue[2]), parseInt(colorValue[3])];
  }
}

/**
 * Function increases opacity of menu object in accordance with progress.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Number} progress - real number from 0.0 till 1.0
 * @param {Array.<Number>} color - current color of menu
 * @param {Array.<Number>} colorValue - delta of color
 */
function show(menuObj, progress, color, colorValue) {
  "use strict";
  menuObj.style.display = 'block';
  menuObj.style.opacity = progress;

  var red = Math.round(color[0] + colorValue[0] * progress);
  var green = Math.round(color[1] + colorValue[1] * progress);
  var blue = Math.round(color[2] + colorValue[2] * progress);
  menuObj.style.backgroundColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

/**
 * Function decreases opacity of menu object in accordance with progress.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Number} progress - real number from 0.0 to 1.0
 */
function hide(menuObj, progress) {
  "use strict";
  if (progress < 1) {
    menuObj.style.opacity = 1 - progress;
  } else {
    menuObj.style.display = 'none';
  }
}

/**
 * The utility function is designed to generate color with random red value.
 *
 * @returns {String} represents string in rgb format (e.g. 'rgb(255, 10, 25)').
 */
function getColor() {
  "use strict";
  return 'rgb(' + Math.round(Math.random() * 255) + ', 75, 75)';
}

/**
 * Function  adds event listeners for dropdown menus.
 */
function ready() {
  "use strict";
  var dropItems = document.getElementsByClassName('menu-item__drop');
  for (var i = 0; i < dropItems.length; ++i) {
    var dropDownMenu = dropItems[i].getElementsByClassName('sub-menu')[0];
    var oldColor = document.defaultView.getComputedStyle(dropDownMenu, null).backgroundColor;
    dropItems[i].addEventListener('mouseenter', drawMenu.bind(null, dropDownMenu, show, 200, oldColor, getColor));
    dropItems[i].addEventListener('mouseleave', drawMenu.bind(null, dropDownMenu, hide, 200, oldColor, getColor));
  }
}

document.addEventListener("DOMContentLoaded", ready);