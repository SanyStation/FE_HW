(function($) {
  "use strict";

  /**
   * This class is created to contain all the constants in the application.
   *
   * @type {{QUESTION_PANE_ID: string,
   *         QUESTION_ID: string,
   *         NAV_PANE_ID: string,
   *         MODAL_ID: string,
   *         WRAPPER_CLASS: string,
   *         NAVBAR_BRAND_CLASS: string,
   *         NAVLINK_CLASS: string,
   *         BUTTON_CLASS: string,
   *         BUTTON_TEST_CLASS: string,
   *         BUTTON_TEST_START_CLASS: string,
   *         TIMER_CLASS: string,
   *         OPTIONS_GROUP_CLASS: string,
   *         QUESTION_CARD_CLASS: string,
   *         ACTIVE_CLASS: string,
   *         SELECTED_CLASS: string,
   *         BUTTON_SUBMIT_CLASS: string,
   *         BUTTON_SKIP_CLASS: string,
   *         BUTTON_STOP_CLASS: string,
   *         BUTTON_OK_CLASS: string,
   *         BUTTON_CLOSE_CLASS: string,
   *         BUTTON_PRIMARY_CLASS: string,
   *         ANSWERED_CLASS: string,
   *         SKIPPED_CLASS: string,
   *         CORRECT_ANSWERED_CLASS: string,
   *         WRONG_ANSWERED_CLASS: string}}
   */
  var constants = {

    TIMER_VALUE: 500,

    QUESTION_PANE_ID: 'questions-pane',
    QUESTION_ID: 'question',
    NAV_PANE_ID: 'nav-pane',
    MODAL_ID: 'modal',

    WRAPPER_CLASS: 'wrapper',
    NAVBAR_BRAND_CLASS: 'navbar-brand',
    NAVLINK_CLASS: 'nav-link',
    BUTTON_CLASS: 'btn',
    BUTTON_TEST_CLASS: 'btn-test',
    BUTTON_START_CLASS: 'btn-start',
    BUTTON_EDIT_CLASS: 'btn-edit',
    TIMER_CLASS: 'navbar-timer',
    OPTIONS_GROUP_CLASS: 'options-group',
    QUESTION_CARD_CLASS: 'question-card',

    ACTIVE_CLASS: 'active',
    SELECTED_CLASS: 'selected',

    BUTTON_SUBMIT_CLASS: 'btn-submit',
    BUTTON_SKIP_CLASS: 'btn-skip',
    BUTTON_STOP_CLASS: 'btn-stop',
    BUTTON_OK_CLASS: 'btn-ok',
    BUTTON_CLOSE_CLASS: 'btn-close',
    BUTTON_PRIMARY_CLASS: 'btn-primary',
    BUTTON_INFO_CLASS: 'btn-info',

    ANSWERED_CLASS: 'answered',
    SKIPPED_CLASS: 'skipped',
    CORRECT_ANSWERED_CLASS: 'correct-answered',
    WRONG_ANSWERED_CLASS: 'wrong-answered',

    RESOURCES_PATH: 'resources',
    TEST_FILE: 'world_geography.json',

    TEST_STATUS: {
      INITIAL: 'initial',
      IN_PROGRESS: 'in_progress',
      FINISHED: 'finished',
      IN_EDITING: 'in_editing'
    }
  };

  /**
   * This class is designed to generate some test elements.
   *
   * @type {{createButton: createButton,
   *         createWrapper: createWrapper,
   *         generateModalWindow: generateModalWindow,}}
   */
  var testConstructor = {

    /**
     * This function is designed to create buttons in the test page.
     *
     * @param {string} buttonName - text on a button
     * @param {Array.<string>} buttonClasses - additional classes for the button
     * @param {XML|Node} parentElement - parent element which button will be created in
     */
    createButton: function(buttonName, buttonClasses, parentElement) {
      return $('<button/>', {
        text : buttonName,
        type : 'button',
        class : buttonClasses.join(' ')
      }).addClass(constants.BUTTON_CLASS).appendTo(parentElement);
    },

    /**
     * This function creates wrapper.
     * It uses as container to gather all questions in itself.
     * It creates in the body of document.
     *
     * @returns {XML|Node} newly created wrapper dom element
     */
    createWrapper: function() {
      return $('<div/>', {
        class : constants.WRAPPER_CLASS
      }).appendTo(document.body);
    },

    /**
     * It's a helper function which generates modal from html template by inquiry.
     *
     * @param {string} title - title of modal window
     * @param {string} text - message of modal window
     */
    generateModalWindow: function(title, text) {
      var modal = helper.generateHtmlFromTemplate(constants.MODAL_ID, {
        title : title,
        text : text
      });
      $('body').append(modal);

      var $modal = $('.modal-window');

      function hideModal() {
        $modal.remove();
      }

      var $btnOk = $modal.find('.' + constants.BUTTON_OK_CLASS);
      var $btnClose = $modal.find('.' + constants.BUTTON_CLOSE_CLASS);
      $btnOk.on('click', hideModal);
      $btnClose.on('click', hideModal);

      $(window).on('click', function(event) {
        if (event.target === $modal.get(0)) {
          hideModal();
        }
      });
    }
  };

  /**
   * This class represents a test. It contains different functions to manage and manipulate the test.
   * There are only two types of test:
   *   1. with single correct option (based on radio buttons)
   *   2. with multiple correct options (based on checkboxes)
   */
  var test = {

    testTitle: null,
    questions: null,
    activeQuestion: '',
    status: null,
    $timer: null,
    timerId: 0,
    currentTimerValue : 0,
    questionType: 'radio',

    /**
     * Function loads and caches a test from file and writes it to localStorage.
     */
    loadQuestions: function() {
      if (!this.questions && localStorage.getItem('test.isLoaded')) {
        this.testTitle = localStorage.getItem('test.testTitle');
        this.questions = JSON.parse(localStorage.getItem('test.questions'));
      } else if (!localStorage.getItem('test.isLoaded')) {
        $.getJSON(constants.RESOURCES_PATH + '/' + constants.TEST_FILE, (function(data) {
          this.questions = data.questions;
          this.testTitle = data.testTitle;
          $('.' + constants.NAVBAR_BRAND_CLASS).html(this.testTitle);
          localStorage.setItem('test.testTitle', this.testTitle);
          localStorage.setItem('test.questions', JSON.stringify(this.questions));
        }).bind(this));
        localStorage.setItem('test.isLoaded', true);
      }
    },

    getStatus: function () {
      return this.status || localStorage.getItem('test.status') || constants.TEST_STATUS.INITIAL;
    },

    setStatus: function(status) {
      this.status = status;
      localStorage.setItem('test.status', status);
    },

    /**
     * Function initializes test.
     * It cleans body document content, loads questions and starts the test.
     */
    init: function() {
      var body = $('body');
      body.empty();
      this.loadQuestions();
      this.status = this.getStatus();

      var navPane = helper.generateHtmlFromTemplate(constants.NAV_PANE_ID, {
        title : test.testTitle,
        constants: constants
      });
      body.append(navPane);

      this.$timer = $('.' + constants.TIMER_CLASS);
      this.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
      this.updateTimer(0);

      var processButtonMessage = '';
      switch(this.getStatus()) {
        case constants.TEST_STATUS.INITIAL:
          processButtonMessage = 'Start Test';
          break;
        case constants.TEST_STATUS.IN_PROGRESS:
          processButtonMessage = 'Continue Test';
          break;
        case constants.TEST_STATUS.FINISHED:
          processButtonMessage = 'Review Results';
          break;
        case constants.TEST_STATUS.IN_EDITING:
          break;
        default:
          throw 'Wrong status of test: ' + this.getStatus();
      }

      var controls = helper.generateHtmlFromTemplate('controls', {
        status: this.getStatus(),
        processButtonTitle: processButtonMessage,
        constants: constants
      });
      testConstructor.createWrapper().append(controls);
      $('.' + constants.BUTTON_START_CLASS).on('click', this.proceedTest.bind(this));
      $('.' + constants.BUTTON_EDIT_CLASS).on('click', this.editTest.bind(this));

    },

    /**
     * Function caches and returns current active question.
     *
     * @returns {string} activeQuestion - id of current active question
     */
    getActiveQuestionId: function() {
      if (!this.activeQuestion) {
        this.activeQuestion = localStorage.getItem('test.activeQuestion') || Object.keys(this.questions)[0];
      }
      return this.activeQuestion;
    },

    setActiveQuestionId: function(activeQuestionId) {
      localStorage.setItem('test.activeQuestion', activeQuestionId);
      this.activeQuestion = activeQuestionId;
    },

    /**
     * Function starts test. The main logic of function is launched by clicking on 'Start' Button.
     * There are 3 types of states:
     * - start test (first initial state);
     * - continue test (when a test has been interrupted);
     * - view results (when a test has been finished).
     */
    proceedTest: function() {
      var self = this;
      $('.' + constants.BUTTON_START_CLASS).hide('fast', function() {
        if (constants.TEST_STATUS.INITIAL === self.getStatus()) {
          self.startTest();
        } else if (constants.TEST_STATUS.IN_PROGRESS === self.getStatus()) {
          self.continueTest();
        }
        self.navPaneBuilder.setQuestionKeys(Object.keys(self.questions));
        $('.' + constants.WRAPPER_CLASS).empty().append(self.navPaneBuilder.build());

        $('.' + constants.NAVLINK_CLASS).on('click', function() {
          var questionId = helper.normalizeId($(this).attr('href'));
          if (questionId !== self.getActiveQuestionId()) {
            self.showActiveQuestion(questionId);
          }
        });
        if (constants.TEST_STATUS.FINISHED === self.getStatus()) {
          self.markQuestions();
        }
        var activeQuestion = self.getActiveQuestionId();
        self.showActiveQuestion(activeQuestion);
      });
    },

    editTest: function() {
      var self = this;
      $('.' + constants.BUTTON_EDIT_CLASS).hide('fast', function() {
        self.setStatus(constants.TEST_STATUS.IN_EDITING);
        self.navPaneBuilder.setQuestionKeys(Object.keys(self.questions));
        self.navPaneBuilder.setStatus(self.getStatus());

        $('.' + constants.WRAPPER_CLASS).empty().append(self.navPaneBuilder.build());
        self.showEditQuestion(self.getActiveQuestionId());

        $('.' + constants.NAVLINK_CLASS).on('click', function() {
          var questionId = helper.normalizeId($(this).attr('href'));
          if (questionId !== self.getActiveQuestionId()) {
            self.showEditQuestion(questionId);
          }
        });
      });
    },

    startTest: function() {
      this.currentTimerValue = 0;
      this.timerId = setInterval(this.updateTimer.bind(this, constants.TIMER_VALUE), constants.TIMER_VALUE);
      localStorage.setItem('test.timer.id', this.timerId);
      this.setStatus(constants.TEST_STATUS.IN_PROGRESS);
    },

    continueTest: function() {
      this.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
      this.timerId = setInterval(this.updateTimer.bind(this, constants.TIMER_VALUE), constants.TIMER_VALUE);
    },

    /**
     * Function marks nav-links of questions in a test.
     * There are 2 types of questions:
     * 1. Correct answered question;
     * 2. wrong answered question or skipped question.
     *
     * @returns {Object} - returns result of 'calculateResults' function
     */
    markQuestions: function() {
      var questions = this.questions;
      var totalQuestions = Object.keys(this.questions).length;
      var successAnswers = 0;

      Object.keys(questions).forEach(function(questionId) {
        var answers = JSON.parse(localStorage.getItem('test.answers.' + questionId));
        var correct = helper.wrapInArray(questions[questionId].correct);

        var questionLink = $('a[href$=' + questionId + ']');
        var isSame = helper.compareArrays(answers, correct);
        if (isSame) {
          questionLink.addClass(constants.CORRECT_ANSWERED_CLASS);
          ++successAnswers;
        } else {
          questionLink.addClass(constants.WRONG_ANSWERED_CLASS);
        }
      });
      return this.calculateResults(totalQuestions, successAnswers);
    },

    /**
     * It's the helper function. It calculates total success rate at the and of a test.
     *
     * @param totalQuestions - total number of questions
     * @param successAnswers - correct answered questions
     * @returns {{totalQuestions: number, successAnswers: number, rate: number}}
     */
    calculateResults: function(totalQuestions, successAnswers) {
      return {
        totalQuestions : totalQuestions,
        successAnswers : successAnswers,
        rate : Math.round((successAnswers / totalQuestions * 1000)) / 10
      };
    },

    /**
     * Function finishes test.
     * Test finishes when a user click on button 'Stop' test.
     * This button can be in two states:
     * 1. 'Stop Tes' - stops the current execution of test;
     * 2. 'Back to the beginning' - this button is allowed in a review mode after test was finished.
     */
    finishTest: function() {
      this.setStatus(constants.TEST_STATUS.FINISHED);
      clearTimeout(this.timerId);
      this.showActiveQuestion(Object.keys(this.questions)[0]);
      var results = this.markQuestions();
      testConstructor.generateModalWindow('Test finished!', 'Total questions: ' +
        results.totalQuestions +
        ', correct answers: ' + results.successAnswers +
        ', success rate: ' + results.rate +
        ' %');
    },

    /**
     * Function selects current question by 'activeQuestionId'.
     * It prints all information about the question:
     * question, possible options, buttons to skip, submit question and stop a test.
     *
     * @param activeQuestionId - id of active question
     */
    showActiveQuestion: function(activeQuestionId) {
      var self = this;
      $('.' + constants.NAVLINK_CLASS).removeClass(constants.ACTIVE_CLASS);
      $('.' + constants.QUESTION_CARD_CLASS).remove();
      var questionLink = $('a[href$=' + activeQuestionId + ']');
      questionLink.addClass(constants.ACTIVE_CLASS);

      this.questionBuilder.setId(activeQuestionId);
      this.questionBuilder.setStatus(self.getStatus());
      this.questionBuilder.setQuestions(self.questions);
      this.questionBuilder.setSkipped(questionLink.hasClass(constants.SKIPPED_CLASS));
      this.questionBuilder.setAnswers(JSON.parse(localStorage.getItem('test.answers.' + activeQuestionId)));
      $('.' + constants.WRAPPER_CLASS).append(this.questionBuilder.build());

      var nextQuestionId = helper.normalizeId($('.' + constants.NAVLINK_CLASS + '.' + constants.ACTIVE_CLASS).parent().next().find('.' + constants.NAVLINK_CLASS).attr('href'));

      if (constants.TEST_STATUS.FINISHED !== self.getStatus()) {
        var $buttonSubmit = $('.' + constants.BUTTON_SUBMIT_CLASS);
        if (!questionLink.hasClass(constants.SKIPPED_CLASS)) {
          var $buttonSkip = $('.' + constants.BUTTON_SKIP_CLASS);
          if (!nextQuestionId) {
            $buttonSubmit.html('Submit and Finish Test');
            $buttonSkip.html('Skip and Finish Test').on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass(constants.SKIPPED_CLASS);
              self.finishTest();
            });
          } else {
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass(constants.SKIPPED_CLASS);
              self.showActiveQuestion(nextQuestionId);
            });
          }
        }
        $buttonSubmit.on('click', function() {
          var answers = [];
          $('.' + constants.BUTTON_PRIMARY_CLASS + '.' + constants.ACTIVE_CLASS + ' > input').each(function() {
            answers.push($(this).attr('value'));
          });
          if (answers.length > 0) {
            localStorage.setItem('test.answers.' + activeQuestionId, JSON.stringify(answers));
            localStorage.removeItem('test.skipped.' + activeQuestionId);
            questionLink.removeClass(constants.SKIPPED_CLASS).addClass(constants.ANSWERED_CLASS);
          } else {
            testConstructor.generateModalWindow('Empty selection', 'Please, choose one or several options (in accordance with type of question)');
            return;
          }
          if (nextQuestionId) {
            self.showActiveQuestion(nextQuestionId);
          } else {
            self.finishTest();
          }
        });
      }
      $('.' + constants.BUTTON_STOP_CLASS).on('click', self.resetTest.bind(self));
      self.setActiveQuestionId(activeQuestionId);
    },

    resetTest: function() {
      this.setStatus(constants.TEST_STATUS.INITIAL);
      this.questions = null;
      clearInterval(this.timerId);
      localStorage.clear();
      this.activeQuestion = null;
      this.init();
    },

    showEditQuestion: function(activeQuestionId) {
      var self = this;
      $('.' + constants.NAVLINK_CLASS).removeClass(constants.ACTIVE_CLASS);
      $('a[href$=' + activeQuestionId + ']').addClass(constants.ACTIVE_CLASS);
      $('.' + constants.QUESTION_CARD_CLASS).remove();
      var question = editableQuestionFactory.initializeQuestion(self.questions[activeQuestionId]);
      $('.' + constants.WRAPPER_CLASS).append(editableQuestionBuilder.build(question));
      self.setActiveQuestionId(activeQuestionId);
      $('.' + constants.BUTTON_STOP_CLASS).on('click', self.resetTest.bind(self));
      $('.' + 'type-question-single').on('click', function() {
        self.questionType = 'radio';
        $('.' + 'option-input').each(function() {
          $(this).attr('type', 'radio');
        });
      });
      $('.' + 'type-question-multiple').on('click', function() {
        self.questionType = 'checkbox';
        $('.' + 'option-input').each(function() {
          $(this).attr('type', 'checkbox');
        });
      });
      $('.' + 'remove-option').on('click', function() {
        $(this).parent().parent().parent().remove();
      });
      $('.' + 'btn-add-option').on('click', function() {
        var $option = helper.generateHtmlFromTemplate('question-option', {
          questionType: self.questionType
        });
        $('.' + 'input-row').last().before($option);
        $('.' + 'remove-option').on('click', function() {
          $(this).parent().parent().parent().remove();
        });
      });
    },

    /**
     * Function updated timer and sets the formatted value to the panel timer.
     *
     * @param {number} value - value which will be added to the total timer counter.
     */
    updateTimer: function(value) {
      value = value || 0;
      this.currentTimerValue = this.currentTimerValue + value;
      var seconds = Math.floor(this.currentTimerValue / 1000) % 60;
      var minutes = Math.floor(this.currentTimerValue / (1000 * 60)) % 60;
      var hours = Math.floor(this.currentTimerValue / (1000 * 60 * 60)) % 24;

      this.$timer.html(('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2));
      localStorage.setItem('test.timer', this.currentTimerValue);
    },

    questionBuilder: {

      id: null,
      questions: null,
      answers: null,
      status: null,
      isSkipped: null,

      setId: function(id) {
        this.id = id;
      },

      setQuestions: function(questions) {
        this.questions = questions;
      },

      setAnswers: function(answers) {
        this.answers = answers;
      },

      setStatus: function(status) {
        this.status = status;
      },

      setSkipped: function(isSkipped) {
        this.isSkipped = isSkipped;
      },

      build: function() {
        return helper.generateHtmlFromTemplate(constants.QUESTION_ID, {
          id: this.id,
          title: this.questions[this.id].name,
          type: Array.isArray(this.questions[this.id].correct) ? 'checkbox' : 'radio',
          options: this.questions[this.id].options,
          answers: this.answers,
          status: this.status,
          correct: helper.wrapInArray(this.questions[this.id].correct),
          isSkipped: this.isSkipped,
          constants: constants
        });
      }
    },

    navPaneBuilder: {

      questionKeys: null,
      status: null,

      setId: function(id) {
        this.id = id;
      },

      setStatus: function(status) {
        this.status = status;
      },

      setQuestionKeys: function(questionKeys) {
        this.questionKeys = questionKeys;
      },

      build: function() {
        return helper.generateHtmlFromTemplate(constants.QUESTION_PANE_ID, {
          ids : this.questionKeys,
          status: this.status,
          constants: constants
        });
      }
    }
  };

  var editableQuestionBuilder = {

    build: function(question) {
      return helper.generateHtmlFromTemplate('edit-question', {
        title: question.getTitle(),
        type: question.getType(),
        options: question.getOptions()
      });
    }
  };

  var editableQuestionFactory = {

    initializeQuestion: function(questionObj) {
      var type = Array.isArray(questionObj.correct) ? 'checkbox' : 'radio';
      var question = this.createQuestion(type);
      question.setTitle(questionObj.name);
      question.addOptions(questionObj.options);
      if (type === 'radio') {
        question.setAnswer(questionObj.correct);
      } else {
        question.addAnswers(questionObj.correct);
      }
      return question;
    },

    createQuestion: function(type) {
      switch (type) {
        case 'radio': return new this.QuestionRadio();
        case 'checkbox': return new this.QuestionCheckbox();
        default: throw 'There is no such type of question: ' + type;
      }
    },

    Question: function() {
      this.title = null;
      this.options = {};
      this.answers = null;

      this.getType = function() {
        throw 'This method should be implemeted by child class';
      };

      this.setTitle = function(title) {
        this.title = title;
      };

      this.getTitle = function() {
        return this.title;
      };

      this.setOption = function(key, value) {
        this.options[key] = value;
      };

      this.addOptions = function(options) {
        var self = this;
        $.each(options, function(key, value) {
          self.setOption(key, value);
        });
      };

      this.getOptions = function() {
        return this.options;
      };
    },

    QuestionRadio: function() {
      editableQuestionFactory.Question.call(this);

      this.getType = function() {
        if (this instanceof editableQuestionFactory.QuestionRadio) {
          return 'radio';
        }
      };

      this.setAnswer = function(answer) {
        this.answers = answer;
      };
    },

    QuestionCheckbox: function() {
      editableQuestionFactory.Question.call(this);

      this.getType = function() {
        if (this instanceof editableQuestionFactory.QuestionCheckbox) {
          return 'checkbox';
        }
      };

      this.addAnswer = function(answer) {
        this.answers = this.answers || [];
        this.answers.push(answer);
      };

      this.addAnswers = function(answers) {
        var self = this;
        $.each(answers, function(key, value) {
          self.addAnswer(value);
        });
      };
    }

  };

  /**
   * It's a helper class. It is created to do additional work with a test.
   *
   * @type {{generateHtmlFromTemplate: generateHtmlFromTemplate,
   *         normalizeId: normalizeId,
   *         compareArrays: compareArrays,
   *         wrapInArray: wrapInArray}}
   */
  var helper = {

    /**
     * Function generates html content from html templates.
     * It finds templates by id.
     *
     * @param scriptId - id of sctipt template
     * @param params - these params substitutes the specified markers in scripts.
     * @returns {string} - generated html string
     */
    generateHtmlFromTemplate: function(scriptId, params) {
      return _.template($('#' + scriptId).html())(params);
    },

    /**
     * Functions cuts the '#' symbol of id of question.
     *
     * @param href - reference with id with '#' symbol
     * @returns {string} - id without '#' symbol
     */
    normalizeId: function(href) {
      if (typeof href === 'string') {
        return href.replace('#', '');
      } else {
        return '';
      }
    },

    /**
     * Function compares two 1D arrays.
     *
     * @param arr1 - the first array
     * @param arr2 - the second array
     * @returns {boolean} - if arrays are the same it returns 'true', else - 'false'.
     */
    compareArrays: function(arr1, arr2) {
      if (!arr1 || !arr2) { return false; }
      if (arr1.length !== arr2.length) { return false; }

      for (var i = 0, l = arr1.length; i < l; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },

    /**
     * Function makes an array from string. It uses to bring a string value to array and compare arrays.
     *
     * @param arg - string value or array.
     * @returns {Array} - wrapped object in array, or if arg is array function returns arg without any changes.
     */
    wrapInArray: function(arg) {
      if (!Array.isArray(arg)) {
        arg = [arg];
      }
      return arg;
    }
  };

  $(function() {
    test.init();
  });
})(jQuery);