/**
 * Function is designed to draw menu by means of requestAnimationFrame.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Function} drawFunction - function which draws the menu
 * @param {Number} duration - duration of animation in milliseconds
 */
function drawMenu(menuObj, drawFunction, duration) {
  "use strict";
  if (duration < 1) {
    duration = 1;
  }
  var start = performance.now();
  requestAnimationFrame(function animate(time) {
    var timePassed = time - start;
    if (timePassed > duration) {
      timePassed = duration;
    }

    drawFunction(menuObj, timePassed / duration, 'rgb(225, 75, 75)');

    if (timePassed < duration) {
      requestAnimationFrame(animate);
    }
  });
}

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
    return [colorValue[1], colorValue[2], colorValue[3]];
  }
}

/**
 * Function increases opacity of menu object in accordance with progress.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Number} progress - real number from 0.0 till 1.0
 * @param colorStatic - current color of menu
 */
function show(menuObj, progress, colorStatic) {
  "use strict";
  menuObj.style.display = 'block';
  menuObj.style.opacity = progress;

  var color = parseColor(colorStatic);

  var k = 0.3;
  var red = Math.round(color[0] - color[0] * k * progress);
  var green = Math.round(color[1] - color[1] * k * progress);
  var blue = Math.round(color[2] - color[2] * k * progress);
  menuObj.style.backgroundColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

/**
 * Function decreases opacity of menu object in accordance with progress.
 *
 * @param {XML|Node} menuObj - menu object which will be drown
 * @param {Number} progress - real number from 0.0 to 1.0
 * @param colorStatic - current color of menu
 */
function hide(menuObj, progress, colorStatic) {
  "use strict";
  progress = 1 - progress;
  if (progress > 0) {
    menuObj.style.opacity = progress;
    var color = parseColor(colorStatic);

    var k = 0.3;
    var red = Math.round((color[0] - color[0] * k) + color[0] * k * (1 - progress));
    var green = Math.round((color[1] - color[1] * k) + color[1] * k * (1 - progress));
    var blue = Math.round((color[2] - color[2] * k) + color[2] * k * (1 - progress));
    menuObj.style.backgroundColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  } else {
    menuObj.style.display = 'none';
  }
}

function ready() {
  "use strict";
  var dropItems = document.getElementsByClassName('menu-item__drop');
  for (var i = 0; i < dropItems.length; ++i) {
    var dropDownMenu = dropItems[i].getElementsByClassName('sub-menu')[0];
    dropItems[i].addEventListener('mouseenter', drawMenu.bind(null, dropDownMenu, show, 200));
    dropItems[i].addEventListener('mouseleave', drawMenu.bind(null, dropDownMenu, hide, 200));
  }
}

document.addEventListener("DOMContentLoaded", ready);