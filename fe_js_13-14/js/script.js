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
    BUTTON_TEST_START_CLASS: 'btn-info',
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

    ANSWERED_CLASS: 'answered',
    SKIPPED_CLASS: 'skipped',
    CORRECT_ANSWERED_CLASS: 'correct-answered',
    WRONG_ANSWERED_CLASS: 'wrong-answered'
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
   *   2. with plural correct options (based on checkboxes)
   *
   * @type {{testTitle: null,
   *         questions: null,
   *         activeQuestion: null,
   *         isTestStarted: null,
   *         isTestFinished: null,
   *         $timer: null,
   *         timerId: number,
   *         currentTimerValue: number,
   *         loadQuestions: loadQuestions,
   *         init: init,
   *         getActiveQuestionId: getActiveQuestionId,
   *         startTest: startTest,
   *         calculateResults: calculateResults,
   *         markQuestions: markQuestions,
   *         markOptions: markOptions,
   *         finishTest: finishTest,
   *         setActiveQuestion: setActiveQuestion,
   *         updateTimer: updateTimer}}
   */
  var test = {

    testTitle : null,
    questions : null,
    activeQuestion : '',
    isTestStarted : null,
    isTestFinished : null,
    $timer : null,
    timerId : 0,
    currentTimerValue : 0,

    /**
     * Function loads and caches a test from file and writes it to localStorage.
     */
    loadQuestions: function() {
      if (!this.questions && localStorage.getItem('test.isLoaded')) {
        this.testTitle = localStorage.getItem('test.testTitle');
        this.questions = JSON.parse(localStorage.getItem('test.questions'));
      } else if (!localStorage.getItem('test.isLoaded')) {
        $.getJSON("resources/world_geography.json", (function(data) {
          this.questions = data.questions;
          this.testTitle = data.testTitle;
          $('.' + constants.NAVBAR_BRAND_CLASS).html(this.testTitle);
          localStorage.setItem('test.testTitle', this.testTitle);
          localStorage.setItem('test.questions', JSON.stringify(this.questions));
        }).bind(this));
        localStorage.setItem('test.isLoaded', true);
      }
    },

    /**
     * Function initializes test.
     * It cleans body document content, loads questions and starts the test.
     */
    init: function() {
      var body = $('body');
      body.empty();
      this.loadQuestions();

      this.isTestStarted = localStorage.getItem('test.isStarted');
      this.isTestFinished = localStorage.getItem('test.isFinished');

      var navPane = helper.generateHtmlFromTemplate(constants.NAV_PANE_ID, {
        title : test.testTitle
      });
      body.append(navPane);

      this.$timer = $('.' + constants.TIMER_CLASS);
      this.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
      this.updateTimer();

      var $wrapper = testConstructor.createWrapper();
      var $button = testConstructor.createButton(
        this.isTestFinished ? 'View Results' : this.isTestStarted ? 'Continue Test' : 'Start Test',
        [constants.BUTTON_TEST_START_CLASS, constants.BUTTON_TEST_CLASS], $wrapper);
      $button.on('click', this.startTest.bind(this));
    },

    /**
     * Function caches and returns current active question.
     *
     * @returns {string} activeQuestion - id of current active question
     */
    getActiveQuestionId: function() {
      if (!this.activeQuestion) {
        this.activeQuestion = localStorage.getItem('test.activeQuestion');
      }
      return this.activeQuestion;
    },

    /**
     * Function starts test. The main logic of function is launched by clicking on 'Start' Button.
     * There are 3 types of states:
     * - start test (first initial state);
     * - continue test (when a test has been interrupted);
     * - view results (when a test has been finished).
     */
    startTest: function() {
      var self = this;
      $('.' + constants.BUTTON_TEST_START_CLASS).hide('fast', function() {
        if (!self.isTestStarted && !self.isTestFinished) {
          localStorage.setItem('test.isStarted', true);
          self.currentTimerValue = 0;
          self.timerId = setInterval(self.updateTimer.bind(self, constants.TIMER_VALUE), constants.TIMER_VALUE);
          localStorage.setItem('test.timer.id', self.timerId);
        } else if (self.isTestStarted) {
          self.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
          self.timerId = setInterval(self.updateTimer.bind(self, constants.TIMER_VALUE), constants.TIMER_VALUE);
        }
        var questionKeys = Object.keys(self.questions);
        var questionsPane = helper.generateHtmlFromTemplate(constants.QUESTION_PANE_ID, {
          ids : questionKeys
        });
        $('.' + constants.WRAPPER_CLASS).append(questionsPane);
        for (var i = 0; i < questionKeys.length; ++i) {
          var skippedAnswers = localStorage.getItem('test.skipped.' + questionKeys[i]);
          if (skippedAnswers) {
            $('a[href$=' + questionKeys[i] + ']').addClass(constants.SKIPPED_CLASS);
          } else {
            var answers = localStorage.getItem('test.answers.' + questionKeys[i]);
            if (answers && answers.length > 0) {
              $('a[href$=' + questionKeys[i] + ']').addClass(constants.ANSWERED_CLASS);
            }
          }
        }
        $('.' + constants.NAVLINK_CLASS).on('click', function() {
          var questionId = helper.normalizeId($(this).attr('href'));
          if (questionId !== self.getActiveQuestionId()) {
            self.setActiveQuestion(questionId);
          }
        });
        if (self.isTestFinished) {
          self.markQuestions();
        }
        var activeQuestion = localStorage.getItem('test.activeQuestion') || Object.keys(self.questions)[0];
        this.remove();
        self.setActiveQuestion(activeQuestion);
      });
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
     * Function marks inputs of options of questions in a test.
     * There are 2 types of options:
     * 1. correct answered option;
     * 2. wrong answered option.
     *
     * @param questionId - id of selected question
     */
    markOptions: function(questionId) {
      var questions = this.questions;
      var $options = $('.' + constants.OPTIONS_GROUP_CLASS);
      var answers = helper.wrapInArray(JSON.parse(localStorage.getItem('test.answers.' + questionId)));
      var correct = helper.wrapInArray(questions[questionId].correct);

      for (var i = 0; i < answers.length; ++i) {
        var input = $options.find('input[value=' + answers[i] + ']');
        input.parent().parent().addClass(constants.WRONG_ANSWERED_CLASS);
        input.attr('checked', true);
      }
      for (var j = 0; j < correct.length; ++j) {
        $options.find('input[value=' + correct[j] + ']').parent().parent().addClass(constants.CORRECT_ANSWERED_CLASS);
      }
    },

    /**
     * Function finishes test.
     * Test finishes when a user click on button 'Stop' test.
     * This button can be in two states:
     * 1. 'Stop Tes' - stops the current execution of test;
     * 2. 'Back to the beginning' - this button is allowed in a review mode after test was finished.
     */
    finishTest: function() {
      localStorage.removeItem('test.isStarted');
      localStorage.setItem('test.isFinished', true);
      this.isTestStarted = null;
      this.isTestFinished = true;

      clearTimeout(this.timerId);

      var firstQuestion = helper.normalizeId($('.' + constants.NAVLINK_CLASS + ':first').attr('href'));
      this.setActiveQuestion(firstQuestion);

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
     * @param activeQuestionId
     */
    setActiveQuestion: function(activeQuestionId) {
      var self = this;
      var questions = self.questions;
      var questionCard = $('.' + constants.QUESTION_CARD_CLASS);
      questionCard.remove();
      $('.' + constants.NAVLINK_CLASS).removeClass(constants.ACTIVE_CLASS);

      var $selectedQuestion = helper.generateHtmlFromTemplate(constants.QUESTION_ID, {
        id : activeQuestionId,
        title : questions[activeQuestionId].name,
        type : Array.isArray(questions[activeQuestionId].correct) ? 'checkbox' : 'radio',
        options : questions[activeQuestionId].options
      });
      $('.' + constants.WRAPPER_CLASS).append($selectedQuestion);

      var questionLink = $('a[href$=' + activeQuestionId + ']');
      var $buttonSubmit = $('.' + constants.BUTTON_SUBMIT_CLASS);
      var $buttonSkip = $('.' + constants.BUTTON_SKIP_CLASS);
      var $buttonStop = $('.' + constants.BUTTON_STOP_CLASS);
      questionLink.addClass(constants.ACTIVE_CLASS);

      var answers = JSON.parse(localStorage.getItem('test.answers.' + activeQuestionId));
      if (answers && answers.length > 0) {
        for (var i = 0; i < answers.length; ++i) {
          var input = $('input[value=' + answers[i] + ']');
          input.parent().parent().addClass(constants.SELECTED_CLASS);
          input.attr('checked', true);
        }
        $('.' + constants.BUTTON_PRIMARY_CLASS + ' > input').attr('disabled', true);
        $buttonSubmit.remove();
        $buttonSkip.remove();
      }
      var nextQuestionId = helper.normalizeId($('.' + constants.NAVLINK_CLASS + '.' + constants.ACTIVE_CLASS).parent().next().find('.' + constants.NAVLINK_CLASS).attr('href'));

      if (self.isTestFinished) {
        $buttonSkip.remove();
        $buttonSubmit.remove();
        $buttonStop.html('Back to the beginning');
        self.markOptions(activeQuestionId);
        $('.' + constants.BUTTON_PRIMARY_CLASS + ' > input').attr('disabled', true);
      } else {
        if (questionLink.hasClass(constants.SKIPPED_CLASS)) {
          $buttonSkip.remove();
        } else {
          if (!nextQuestionId) {
            $buttonSubmit.html('Submit and Finish Test');
            $buttonSkip.html('Skip and Finish Test');
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass(constants.SKIPPED_CLASS);
              self.finishTest();
            });
          } else {
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass(constants.SKIPPED_CLASS);
              self.setActiveQuestion(nextQuestionId);
            });
          }
        }
        $buttonSubmit.on('click', function() {
          answers = [];
          $('.' + constants.BUTTON_PRIMARY_CLASS + '.' + constants.ACTIVE_CLASS + ' > input').each(function() {
            answers.push($(this).attr('value'));
          });
          if (answers.length > 0) {
            localStorage.setItem('test.answers.' + activeQuestionId, JSON.stringify(answers));
            localStorage.removeItem('test.skipped.' + activeQuestionId);
            questionLink.removeClass(constants.SKIPPED_CLASS).addClass(constants.ANSWERED_CLASS);//TODO Remove due to line below
            questionCard.remove();
          } else {
            testConstructor.generateModalWindow('Empty selection', 'Please, choose one or several options (in accordance with type of question)');
            return;
          }
          if (nextQuestionId) {
            self.setActiveQuestion(nextQuestionId);
          } else {
            self.finishTest();
          }
        });
      }
      $buttonStop.on('click', function() {
        self.questions = null;
        clearInterval(self.timerId);
        localStorage.clear();
        self.init();
      });
      self.activeQuestion = activeQuestionId;
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