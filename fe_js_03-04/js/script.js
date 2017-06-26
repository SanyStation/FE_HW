var pageConstructor = {

  WRAPPER_CLASS : 'wrapper',
  TITLE_CLASS : 'title',
  QUESTION_CLASS : 'question',
  QUESTION_HEADER_CLASS : 'question__header',
  QUESTION_OPTION_CLASS : 'question__option',

  createWrapper : function () {
    "use strict";
    var wrapper = document.createElement('form');
    wrapper.classList.add(this.WRAPPER_CLASS);
    return document.body.appendChild(wrapper);
  },

  createHeader : function (tagName, className, titleName, parentElement) {
    "use strict";
    var title = document.createElement(tagName);
    title.classList.add(className);
    title.innerHTML = titleName;
    return parentElement.appendChild(title);
  },

  createQuestion : function (questionTitle, questionOptions, questionType, correctOptions, parentElement) {
    "use strict";
    questionType = 'checkbox' === questionType ? 'checkbox' : 'radio';

    var question = document.createElement('div');
    question.classList.add(this.QUESTION_CLASS);
    pageConstructor.createHeader('h2', this.QUESTION_HEADER_CLASS, questionTitle, question);

    var optionsList = document.createElement('ul');

    for (var i = 0; i < questionOptions.length; ++i) {
      var listItem = document.createElement('li');
      var option = document.createElement('input');
      option.setAttribute('type', questionType);
      option.setAttribute('name', questionTitle);
      option.id = idGenerator.generateId(option.tagName);
      option.classList.add(this.QUESTION_OPTION_CLASS);

      question.appendChild(option);

      var optionTitle = document.createElement('label');
      optionTitle.setAttribute('for', option.id);
      optionTitle.innerHTML = questionOptions[i];

      listItem.appendChild(option);
      listItem.appendChild(optionTitle);

      optionsList.appendChild(listItem);
    }

    question.appendChild(optionsList);
    parentElement.appendChild(question);
  }
};

var idGenerator = {

  generateId : function (tagName) {
    "use strict";
    if (typeof this.generateId.counter === 'undefined') {
      this.generateId.counter = 0;
    } else {
      ++this.generateId.counter;
    }
    var currentDate = new Date();
    return tagName + '-' +
           currentDate.getDay() +
           currentDate.getHours() +
           currentDate.getMinutes() +
           currentDate.getSeconds() +
           currentDate.getMilliseconds() +
           this.generateId.counter;
  }
};

var options = ['Variant 1', 'Variant 2', 'Variant 3', 'Variant 4', 'Variant 5'];
var correctOptions = [1, 2];

var wrapper = pageConstructor.createWrapper();
pageConstructor.createHeader('h1', 'title', 'Programming Test', wrapper);
pageConstructor.createQuestion('Question 1: The first question?', options, 'radio', 1, wrapper);
pageConstructor.createQuestion('Question 2: The second question?', options, 'radio', 1, wrapper);
pageConstructor.createQuestion('Question 3: The third question?', options, 'checkbox', correctOptions, wrapper);

