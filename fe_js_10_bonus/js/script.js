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
 * @param {Number} progress - real number from 0.0 till 1.0
 */
function show(menuObj, progress) {
  "use strict";
  menuObj.style.display = 'block';
  menuObj.style.opacity = progress;
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