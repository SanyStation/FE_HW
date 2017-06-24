var ARR_SIZE = 5;
var names = [];
var specifiedNamePos = -1;

for (var i = 0; i < ARR_SIZE; ++i) {
  names[i] = window.prompt('Please, enter the name ' + (i + 1), '');
}

do {
  var specifiedName = window.prompt('Please, specify a name to find it or type "exit" to exit');

  if ('exit' === specifiedName) {
    break;
  }
  
  for (var i = 0; i < ARR_SIZE; ++i) {
    if (specifiedName === names[i]) {
      specifiedNamePos = i;
      break;
    }
  }

  if (specifiedNamePos < 0) {
    window.alert('There is no such name: ' + specifiedName + '. Please, try again or type "exit" to exit');
  } else {
    window.alert(specifiedName + ', you have logged in!');
  }
} while (specifiedNamePos < 0);

