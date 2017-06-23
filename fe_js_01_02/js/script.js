var ARR_SIZE = 5;
var names = [];

for (var i = 0; i < ARR_SIZE; ++i) {
  names[i] = prompt('Please, enter the name ' + (i + 1));
}

do {
  var specifiedName = prompt('Please, specify a name to find it or type "exit" to exit');
  var specifiedNamePos = names.indexOf(specifiedName);
  if ('exit' == specifiedName) {
    break;
  }
  if (specifiedNamePos < 0) {
    alert('There is no such name: ' + specifiedName + '. Please, try again or type "exit" to exit');
  } else {
    alert(specifiedName + ', you have logged in!');
  }
} while (specifiedNamePos < 0);

