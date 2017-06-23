function pow(number, power) {
  number = Number(number);
  power = Number(power);
  if (!Number.isInteger(power)) {
    return NaN;
  }
  if (power === 0) {
    return number === 0 ? NaN : 1;
  } else {
    var tmpNumber = number;
    var tmpPower = power;
    while (--tmpPower > 0) {
      number *= tmpNumber;
    }
    if (power > 0) {
      return number;
    } else {
      return 1 / number;
    }
  }
}

var number = prompt('Please, enter the number');
var power = prompt('Please, enter the power of number');
var result = pow(number, power);
if (Number.isNaN(result)) {
  console.log('Function is not able to calculate. Please, check your input params: number = ' + number + '; power = ' + power + '. Power shoud be an integer value. Also be sure number and power do not equal 0 simultaneously.');
} else {
  console.log(number + '^' + power + ' = ', result);
}