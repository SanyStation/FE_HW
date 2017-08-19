(function($) {
  "use strict";

  var consts = {

  };

  /**
   * This class is designed to generate page for test.
   * There are only two types of test:
   *   1. with single correct option (based on radio buttons)
   *   2. with plural correct options (based on checkboxes)
   *
   * @type {{NAVBAR_CLASS: string,
 *         NAVBAR_TYPE_CLASS: string,
 *         NAVBAR_HEADER: string,
 *         NAVBAR_REF: string,
 *         NAVBAR_CONTAINER: string,
 *         WRAPPER_CLASS: string,
 *         QUESTION_CLASS: string,
 *         QUESTION_CLASS_TYPE: string,
 *         QUESTION_HEADER_CLASS: string,
 *         QUESTION_TITLE_CLASS: string,
 *         QUESTION_BODY_CLASS: string,
 *         QUESTION_LIST_CLASS: string,
 *         QUESTION_LIST_ITEM_CLASS: string,
 *         QUESTION_INPUT_RADIO_CLASS: string,
 *         QUESTION_INPUT_CHECKBOX_CLASS: string,
 *         BUTTON_CLASS: string, BUTTON_SUBMIT_CLASS: string,
 *
 *         createNavbar: testConstructor.createNavbar,
 *         createWrapper: testConstructor.createWrapper,
 *         createHeader: testConstructor.createHeader,
 *         createQuestion: testConstructor.createQuestion,
 *         createButton: testConstructor.createButton}}
   */
  var testConstructor = {

    NAVBAR_CLASS: 'navbar',
    NAVBAR_TYPE_CLASS: 'navbar-inverse',
    NAVBAR_HEADER: 'navbar-header',
    NAVBAR_REF: 'navbar-brand',
    NAVBAR_CONTAINER: 'container',

    WRAPPER_CLASS: 'wrapper',
    QUESTION_CLASS: 'panel',
    QUESTION_CLASS_TYPE: 'panel-primary',
    QUESTION_HEADER_CLASS: 'panel-heading',
    QUESTION_TITLE_CLASS: 'panel-title',
    QUESTION_BODY_CLASS: 'panel-body',
    QUESTION_LIST_CLASS: 'list-group',
    QUESTION_LIST_ITEM_CLASS: 'list-group-item',
    QUESTION_INPUT_RADIO_CLASS: 'radio',
    QUESTION_INPUT_CHECKBOX_CLASS: 'checkbox',

    BUTTON_CLASS: 'btn',
    BUTTON_SUBMIT_CLASS: 'btn-primary',
    BUTTON_TEST_CLASS: 'btn-test',
    BUTTON_TEST_START_CLASS: 'btn-info',
    BUTTON_TEST_FINISH_CLASS: 'btn-warning',

    createButton : function(buttonName, buttonClasses, parentElement) {
      return $('<button/>', {
        text : buttonName,
        type : 'button',
        class : buttonClasses.join(' ')
      }).addClass(testConstructor.BUTTON_CLASS).appendTo(parentElement);
    },

    /**
     * This function creates form-wrapper.
     * It uses as container to gather all questions in itself.
     *
     * @returns {Node} newly created form-wrapper dom element
     */
    createWrapper : function() {
      return $('<div/>', {
        class : this.WRAPPER_CLASS
      }).appendTo(document.body);
    }
  };

  var test = {

    questions : null,
    activeQuestion : null,
    isTestStarted : null,
    isTestFinished : null,
    $timer : null,
    currentTimerValue : 0,
    timerId : null,

    loadQuestions : function(context) {
      if (!context.questions && localStorage.getItem('test.isLoaded')) {
        context.questions = JSON.parse(localStorage.getItem('test.questions'));
      } else if (!localStorage.getItem('test.isLoaded')) {
        $.getJSON("resources/world_geography.json", function(data) {
          context.questions = data.questions;
          localStorage.setItem('test.questions', JSON.stringify(context.questions));
        });
        localStorage.setItem('test.isLoaded', true);
      }
    },

    init : function() {
      var body = $('body');
      body.empty();
      this.loadQuestions(this);
      test.isTestStarted = localStorage.getItem('test.isStarted');
      test.isTestFinished = localStorage.getItem('test.isFinished');

      var navPane = helper.generateHtmlFromTemplate('nav-pane', {
        title : 'World Geopraphy Test'
      });
      body.append(navPane);
      test.$timer = $('.navbar-timer');
      test.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
      test.updateTimer();

      var $wrapper = testConstructor.createWrapper();
      var $button = testConstructor.createButton(
        test.isTestFinished ? 'View Results' : test.isTestStarted ? 'Continue Test' : 'Start Test',
        [testConstructor.BUTTON_TEST_START_CLASS, testConstructor.BUTTON_TEST_CLASS], $wrapper);
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
      $('.' + testConstructor.BUTTON_TEST_START_CLASS).hide('fast', function() {
        if (!test.isTestStarted && !test.isTestFinished) {
          localStorage.setItem('test.isStarted', true);
          test.currentTimerValue = 0;
          test.timerId = setInterval(test.updateTimer, 500);
        } else if (test.isTestStarted) {
          test.currentTimerValue = parseInt(localStorage.getItem('test.timer')) || 0;
          test.timerId = setInterval(test.updateTimer, 500);
        }
        var questionKeys = Object.keys(test.questions);
        var questionsPane = helper.generateHtmlFromTemplate('questions-pane', {
          ids : questionKeys
        });
        $('.' + testConstructor.WRAPPER_CLASS).append(questionsPane);
        for (var i = 0; i < questionKeys.length; ++i) {
          var skippedAnswers = localStorage.getItem('test.skipped.' + questionKeys[i]);
          if (skippedAnswers) {
            $('a[href$=' + questionKeys[i] + ']').addClass('skipped');
          } else {
            var answers = localStorage.getItem('test.answers.' + questionKeys[i]);
            if (answers && answers.length > 0) {
              $('a[href$=' + questionKeys[i] + ']').addClass('answered');
            }
          }
        }
        $('.nav-link').on('click', function() {
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

    markQuestions : function() {
      var questions = test.questions;
      var totalQuestions = Object.keys(test.questions).length;
      var successAnswers = 0;
      Object.keys(questions).forEach(function(questionId) {
        var answers = JSON.parse(localStorage.getItem('test.answers.' + questionId));
        var correct = helper.wrapInArray(questions[questionId].correct);
        var isSame = helper.compareArrays(answers, correct);
        var questionLink = $('a[href$=' + questionId + ']');
        if (isSame) {
          questionLink.addClass('correct-answered');
          ++successAnswers;
        } else {
          questionLink.addClass('wrong-answered');
        }
      });
      return {
        totalQuestions : totalQuestions,
        successAnswers : successAnswers,
        rate : Math.round((successAnswers / totalQuestions * 1000)) / 10
      };
    },

    markOptions : function(questionId) {
      var questions = test.questions;
      var $options = $('.list-group.btn-group');
      var answers = helper.wrapInArray(JSON.parse(localStorage.getItem('test.answers.' + questionId)));
      var correct = helper.wrapInArray(questions[questionId].correct);

      for (var i = 0; i < answers.length; ++i) {
        var input = $options.find('input[value=' + answers[i] + ']');
        input.parent().parent().addClass('wrong-answered');
        input.attr('checked', true);
      }
      for (var j = 0; j < correct.length; ++j) {
        $options.find('input[value=' + correct[j] + ']').parent().parent().addClass('correct-answered');
      }
    },

    finishTest : function() {
      localStorage.removeItem('test.isStarted');
      localStorage.setItem('test.isFinished', true);
      test.isTestStarted = null;
      test.isTestFinished = true;
      clearTimeout(test.timerId);
      var results = this.markQuestions();
      var firstQuestion = helper.normalizeId($('.nav-link:first').attr('href'));
      test.setActiveQuestion(firstQuestion);
      test.generateModalWindow('Test finished!', 'Total questions: ' +
        results.totalQuestions +
        ', correct answers: ' + results.successAnswers +
        ', success rate: ' + results.rate +
        ' %');
    },

    setActiveQuestion : function(activeQuestionId) {
      var questions = test.questions;
      var questionCard = $('.question-card');
      questionCard.remove();
      $('.nav-link').removeClass('active');

      var $selectedQuestion = helper.generateHtmlFromTemplate('question', {
        id : activeQuestionId,
        title : questions[activeQuestionId].name,
        type : Array.isArray(questions[activeQuestionId].correct) ? 'checkbox' : 'radio',
        options : questions[activeQuestionId].options
      });
      $('.' + testConstructor.WRAPPER_CLASS).append($selectedQuestion);

      var questionLink = $('a[href$=' + activeQuestionId + ']');
      var $buttonSubmit = $('.btn-submit');
      var $buttonSkip = $('.btn-skip');
      var $buttonStop = $('.btn-stop');
      questionLink.addClass('active');

      var answers = JSON.parse(localStorage.getItem('test.answers.' + activeQuestionId));
      if (answers && answers.length > 0) {
        for (var i = 0; i < answers.length; ++i) {
          $('input[value=' + answers[i] + ']').parent().parent().addClass('selected');
        }
        $buttonSubmit.remove();
        $buttonSkip.remove();
      }
      var nextQuestionId = helper.normalizeId($('.nav-link.active').parent().next().find('.nav-link').attr('href'));

      if (test.isTestFinished) {
        $buttonSkip.remove();
        $buttonSubmit.remove();
        $buttonStop.html('Back to the beginning');
        test.markOptions(activeQuestionId);
        $('.btn-primary > input').attr('disabled', true);
      } else {
        if (questionLink.hasClass('skipped')) {
          $buttonSkip.remove();
        } else {
          if (!nextQuestionId) {
            $buttonSubmit.html('Submit and Finish Test');
            $buttonSkip.html('Skip and Finish Test');
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass('skipped');
              test.finishTest();
            });
          } else {
            $buttonSkip.on('click', function() {
              localStorage.setItem('test.skipped.' + activeQuestionId, true);
              questionLink.addClass('skipped');
              test.setActiveQuestion(nextQuestionId);
            });
          }
        }
        $buttonSubmit.on('click', function() {
          answers = [];
          $('.btn-primary.active > input').each(function() {
            answers.push($(this).attr('value'));
          });
          if (answers.length > 0) {
            localStorage.setItem('test.answers.' + activeQuestionId, JSON.stringify(answers));
            localStorage.removeItem('test.skipped.' + activeQuestionId);
            questionLink.removeClass('skipped').addClass('answered');
            questionCard.remove();
          } else {
            test.generateModalWindow('Empty selection', 'Please, choose one or several options (according to type of question)');
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
      var modal = helper.generateHtmlFromTemplate('modal', {
        title : title,
        text : text
      });
      $('body').append(modal);

      var $modal = $('.modal-window');

      function hideModal() {
        $modal.remove();
      }

      var $btnOk = $modal.find('.btn-ok');
      var $btnClose = $modal.find('.btn-close');
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