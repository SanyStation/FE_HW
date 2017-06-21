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