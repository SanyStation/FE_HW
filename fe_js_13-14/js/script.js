(function($) {
  "use strict";

  var consts = {

  };

  /**
   * This class is designed to generate page for test.
   * There are only two types of test:
   *   1. with single correct option (based on radio buttons)
   *   2. with plural correct options (based on checkboxes)
   */
  var constants = {

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
    WRONG_ANSWERED_CLASS: 'wrong-answered',

    createButton: function(buttonName, buttonClasses, parentElement) {
      return $('<button/>', {
        text : buttonName,
        type : 'button',
        class : buttonClasses.join(' ')
      }).addClass(constants.BUTTON_CLASS).appendTo(parentElement);
    },

    /**
     * This function creates form-wrapper.
     * It uses as container to gather all questions in itself.
     *
     * @returns {Node} newly created form-wrapper dom element
     */
    createWrapper: function() {
      return $('<div/>', {
        class : this.WRAPPER_CLASS
      }).appendTo(document.body);
    }
  };

  var test = {

    testTitle : null,
    questions : null,
    activeQuestion : null,
    isTestStarted : null,
    isTestFinished : null,
    $timer : null,
    timerId : null,
    currentTimerValue : 0,

    loadQuestions : function() {
      if (!test.questions && localStorage.getItem('test.isLoaded')) {
        test.testTitle = localStorage.getItem('test.testTitle');
        test.questions = JSON.parse(localStorage.getItem('test.questions'));
      } else if (!localStorage.getItem('test.isLoaded')) {
        $.getJSON("resources/world_geography.json", function(data) {
          test.testTitle = data.testTitle;
          test.questions = data.questions;
          localStorage.setItem('test.testTitle', test.testTitle);
          localStorage.setItem('test.questions', JSON.stringify(test.questions));
          $('.' + constants.NAVBAR_BRAND_CLASS).html(test.testTitle);
        });
        localStorage.setItem('test.isLoaded', true);
      }
    },

    init : function() {
      var body = $('body');
      body.empty();
      this.loadQuestions();

      test.isTestStarted = localStorage.getItem('test.isStarted');
      test.isTestFinished = localStorage.getItem('test.isFinished');

      var navPane = helper.generateHtmlFromTemplate(constants.NAV_PANE_ID, {
        title : test.testTitle
      });
      body.append(navPane);

      test.$timer = $('.' + constants.TIMER_CLASS);
      test.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
      test.updateTimer();

      var $wrapper = constants.createWrapper();
      var $button = constants.createButton(
        test.isTestFinished ? 'View Results' : test.isTestStarted ? 'Continue Test' : 'Start Test',
        [constants.BUTTON_TEST_START_CLASS, constants.BUTTON_TEST_CLASS], $wrapper);
      $button.on('click', this.startTest);
    },

    getActiveQuestionId : function() {
      if (test.activeQuestion) {
        return test.activeQuestion;
      } else {
        test.activeQuestion = localStorage.getItem('activeQuestion');
        return test.activeQuestion;
      }
    },

    startTest : function() {
      $('.' + constants.BUTTON_TEST_START_CLASS).hide('fast', function() {
        if (!test.isTestStarted && !test.isTestFinished) {
          localStorage.setItem('test.isStarted', true);
          test.currentTimerValue = 0;
          test.timerId = setInterval(test.updateTimer, 500);
        } else if (test.isTestStarted) {
          test.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
          test.timerId = setInterval(test.updateTimer, 500);
        }
        var questionKeys = Object.keys(test.questions);
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
          var activeQuestionId = test.getActiveQuestionId();
          if (questionId !== activeQuestionId) {
            test.setActiveQuestion(questionId);
          }
        });
        if (test.isTestFinished) {
          test.markQuestions();
        }
        var activeQuestion = localStorage.getItem('test.activeQuestion') || Object.keys(test.questions)[0];
        this.remove();
        test.setActiveQuestion(activeQuestion);
        });
    },

    calculateResults : function(totalQuestions, successAnswers) {
      return {
        totalQuestions : totalQuestions,
        successAnswers : successAnswers,
        rate : Math.round((successAnswers / totalQuestions * 1000)) / 10
      };
    },

    markQuestions : function() {
      var questions = test.questions;
      var totalQuestions = Object.keys(test.questions).length;
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
      return test.calculateResults(totalQuestions, successAnswers);
    },

    markOptions : function(questionId) {
      var questions = test.questions;
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

    finishTest : function() {
      localStorage.setItem('test.isFinished', true);
      localStorage.removeItem('test.isStarted');
      test.isTestStarted = null;
      test.isTestFinished = true;

      clearTimeout(test.timerId);

      var firstQuestion = helper.normalizeId($('.' + constants.NAVLINK_CLASS + ':first').attr('href'));
      test.setActiveQuestion(firstQuestion);

      var results = this.markQuestions();
      test.generateModalWindow('Test finished!', 'Total questions: ' +
        results.totalQuestions +
        ', correct answers: ' + results.successAnswers +
        ', success rate: ' + results.rate +
        ' %');
    },

    setActiveQuestion : function(activeQuestionId) {
      var questions = test.questions;
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
          $('input[value=' + answers[i] + ']').parent().parent().addClass(constants.SELECTED_CLASS);
        }
        $buttonSubmit.remove();
        $buttonSkip.remove();
      }
      var nextQuestionId = helper.normalizeId($('.' + constants.NAVLINK_CLASS + '.' + constants.ACTIVE_CLASS).parent().next().find('.' + constants.NAVLINK_CLASS).attr('href'));

      if (test.isTestFinished) {
        $buttonSkip.remove();
        $buttonSubmit.remove();
        $buttonStop.html('Back to the beginning');
        test.markOptions(activeQuestionId);
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
              test.finishTest();
            });
          } else {
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass(constants.SKIPPED_CLASS);
              test.setActiveQuestion(nextQuestionId);
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
            questionLink.removeClass(constants.SKIPPED_CLASS).addClass(constants.ANSWERED_CLASS);
            questionCard.remove();
          } else {
            test.generateModalWindow('Empty selection', 'Please, choose one or several options (in accordance with type of question)');
            return;
          }
          if (nextQuestionId) {
            test.setActiveQuestion(nextQuestionId);
          } else {
            test.finishTest();
          }
        });
      }
      $buttonStop.on('click', function() {
        test.questions = null;
        clearInterval(test.timerId);
        localStorage.clear();
        test.init();
      });
      localStorage.setItem('test.activeQuestion', activeQuestionId);
    },

    generateModalWindow : function(title, text) {
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
    },

    /**
     * Function updated timer.
     */
    updateTimer : function() {
      test.currentTimerValue = test.currentTimerValue + 500;
      var seconds = Math.floor(test.currentTimerValue / 1000) % 60;
      var minutes = Math.floor(test.currentTimerValue / (1000 * 60)) % 60;
      var hours = Math.floor(test.currentTimerValue / (1000 * 60 * 60)) % 24;

      test.$timer.html(('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2));
      localStorage.setItem('test.timer', test.currentTimerValue);
    }
  };

  var helper = {

    generateHtmlFromTemplate : function(scriptId, params) {
      return _.template($('#' + scriptId).html())(params);
    },

    normalizeId : function(href) {
      if (typeof href === 'string') {
        return href.replace('#', '');
      } else {
        return null;
      }
    },

    compareArrays : function(arr1, arr2) {
      if (!arr1 || !arr2) { return false; }
      if (arr1.length !== arr2.length) { return false; }

      for (var i = 0, l = arr1.length; i < l; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },

    wrapInArray : function(arg) {
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