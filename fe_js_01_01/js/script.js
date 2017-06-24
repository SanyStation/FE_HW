/**
 * Returns x to power of n only if n is integer
 *
 * @param {number} x to be powered
 * @param {number} n the power
 * @returns {number} x to the power of n
 */
function pow(x, n) {
  "use strict";

  x = Number(x);
  n = Number(n);

  if (!Number.isInteger(n)) {
    return NaN;
  }

  if (n === 0) {
    return x === 0 ? NaN : 1;
  }

  var tmpNumber = x;
  var tmpPower = n;

  while (--tmpPower > 0) {
    x *= tmpNumber;
  }

  if (n > 0) {
    return x;
  }
  return 1 / x;
}

var x = window.prompt('Please, enter the x');
var n = window.prompt('Please, enter the n of x');
var result = pow(x, n);
if (Number.isNaN(result)) {
  window.console.log('Function is not able to calculate. Please, check your input params: x = ' + x + '; n = ' + n + '. Power should be an integer value. Also be sure x and n do not equal 0 simultaneously.');
} else {
  window.console.log(x + '^' + n + ' = ', result);
}