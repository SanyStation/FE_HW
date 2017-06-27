//TODO comments
var testConstructor = {

  NAVBAR_CLASS : 'navbar',
  NAVBAR_TYPE_CLASS : 'navbar-inverse',
  NAVBAR_HEADER : 'navbar-header',
  NAVBAR_REF : 'navbar-brand',
  NAVBAR_CONTAINER : 'container',

  WRAPPER_CLASS : 'wrapper',
  QUESTION_CLASS : 'panel',
  QUESTION_CLASS_TYPE : 'panel-primary',
  QUESTION_HEADER_CLASS : 'panel-heading',
  QUESTION_TITLE_CLASS : 'panel-title',
  QUESTION_BODY_CLASS : 'panel-body',
  QUESTION_LIST_CLASS : 'list-group',
  QUESTION_LIST_ITEM_CLASS : 'list-group-item',
  QUESTION_INPUT_RADIO_CLASS : 'radio',
  QUESTION_INPUT_CHECKBOX_CLASS : 'checkbox',

  BUTTON_CLASS : 'btn',
  BUTTON_SUBMIT_CLASS : 'btn-primary',

  //TODO comments
  createNavbar : function () {
    'use strict';
    var navBar = document.createElement('nav');
    navBar.classList.add(this.NAVBAR_CLASS, this.NAVBAR_TYPE_CLASS);
    var container = document.createElement('div');
    container.classList.add(this.NAVBAR_CONTAINER);
    navBar.appendChild(container);

    var navHeader = document.createElement('div');
    navHeader.classList.add(this.NAVBAR_HEADER);
    container.appendChild(navHeader);

    var navRef = document.createElement('a');
    navRef.classList.add(this.NAVBAR_REF);
    navRef.setAttribute('href', 'index.html');
    navRef.innerHTML = 'Programming Test';
    navHeader.appendChild(navRef);

    return document.body.appendChild(navBar);
  },

  //TODO comments
  createWrapper : function () {
    'use strict';
    var wrapper = document.createElement('form');
    wrapper.classList.add(this.WRAPPER_CLASS);
    wrapper.setAttribute('action', 'index.html');
    return document.body.appendChild(wrapper);
  },

  //TODO comments
  createHeader : function (tagName, className, titleName, parentElement) {
    'use strict';
    var title = document.createElement(tagName);
    title.classList.add(className);
    title.innerHTML = titleName;
    return parentElement.appendChild(title);
  },

  //TODO comments
  createQuestion : function (questionTitle, questionOptions, questionType, correctOptions, parentElement) {
    'use strict';
    var question = document.createElement('div');
    question.classList.add(this.QUESTION_CLASS, this.QUESTION_CLASS_TYPE);
    parentElement.appendChild(question);

    var questionHeading = document.createElement('div');
    questionHeading.classList.add(this.QUESTION_HEADER_CLASS);
    testConstructor.createHeader('h4', this.QUESTION_TITLE_CLASS, questionTitle, questionHeading);
    question.appendChild(questionHeading);

    var optionsList = document.createElement('ul');
    optionsList.classList.add(this.QUESTION_LIST_CLASS, this.QUESTION_BODY_CLASS);
    question.appendChild(optionsList);

    questionType = 'checkbox' === questionType ? 'checkbox' : 'radio';

    for (var i = 0; i < questionOptions.length; ++i) {
      var listItem = document.createElement('li');
      listItem.classList.add(this.QUESTION_LIST_ITEM_CLASS,
          questionType === 'radio' ?this.QUESTION_INPUT_RADIO_CLASS : this.QUESTION_INPUT_CHECKBOX_CLASS);

      var option = document.createElement('input');
      option.setAttribute('type', questionType);
      option.setAttribute('name', questionTitle);
      option.setAttribute('value', 'option' + i);

      var optionTitle = document.createElement('label');
      optionTitle.appendChild(option);
      optionTitle.innerHTML += questionOptions[i];
      listItem.appendChild(optionTitle);
      optionsList.appendChild(listItem);
    }
  },

  //TODO comments
  createButtonSubmit : function (parentElement) {
    'use strict';
    var button = document.createElement('button');
    button.classList.add(this.BUTTON_CLASS, this.BUTTON_SUBMIT_CLASS);
    button.innerHTML = 'Submit Test';
    parentElement.appendChild(button);
  }
};

var options = ['Variant 1', 'Variant 2', 'Variant 3', 'Variant 4', 'Variant 5'];
var correctOptions = [1, 2];

testConstructor.createNavbar();
var wrapper = testConstructor.createWrapper();
testConstructor.createQuestion('Question 1: The first question?', options, 'radio', 1, wrapper);
testConstructor.createQuestion('Question 2: The second question?', options, 'radio', 1, wrapper);
testConstructor.createQuestion('Question 3: The third question?', options, 'checkbox', correctOptions, wrapper);
testConstructor.createButtonSubmit(wrapper);
