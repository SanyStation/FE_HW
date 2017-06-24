/**
 * Returns x to power of n only if n is integer
 *
 * @param {number} x to be powered
 * @param {number} n the power
 * @returns {number} x to the power of n
 */
function pow(x, n) {
  x = Number(x);
  n = Number(n);
  if (!Number.isInteger(n)) {
    return NaN;
  }
  if (n === 0) {
    return x === 0 ? NaN : 1;
  } else {
    var tmpNumber = x;
    var tmpPower = n;
    while (--tmpPower > 0) {
      x *= tmpNumber;
    }
    if (n > 0) {
      return x;
    } else {
      return 1 / x;
    }
  }
}

var x = prompt('Please, enter the x');
var n = prompt('Please, enter the n of x');
var result = pow(x, n);
if (Number.isNaN(result)) {
  console.log('Function is not able to calculate. Please, check your input params: x = ' + x + '; n = ' + n + '. Power shoud be an integer value. Also be sure x and n do not equal 0 simultaneously.');
} else {
  console.log(x + '^' + n + ' = ', result);
}