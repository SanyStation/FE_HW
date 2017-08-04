/**
 * This is utility class. It provides methods to manipulate with stopwatch object model.
 *
 * @type {{findDomElements: helper.findDomElements,
 *         applyEventListeners: helper.applyEventListeners,
 *         changeClass: helper.changeClass}}
 */
var helper = {

  /**
   * Function finds objects related to stopwatch object and assigns they to stopwatchObj.
   *
   * @param stopwatchObj object to manipulate with stopwatch
   */
  findDomElements : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn = document.querySelector('.' + stopwatchObj.START_PAUSE_BTN_CLASS);
    stopwatchObj.resetBtn = document.querySelector('.' + stopwatchObj.RESET_BTN_CLASS);
    stopwatchObj.splitBtn = document.querySelector('.' + stopwatchObj.SPLIT_BTN_CLASS);
    stopwatchObj.timer = document.querySelector('.' + stopwatchObj.STOPWATCH_BOARD_CLASS);
    stopwatchObj.splitTable = document.querySelector('.' + stopwatchObj.SPLIT_TABLE_CLASS + ' tbody');
  },

  /**
   * Function applies event listeners for stopwatchObj.
   *
   * @param stopwatchObj object to manipulate with stopwatch
   */
  applyEventListeners : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn.addEventListener('click', stopwatchObj.startPauseStopwatch.bind(stopwatchObj));
    stopwatchObj.resetBtn.addEventListener('click', stopwatchObj.resetStopwatch.bind(stopwatchObj));
    stopwatchObj.splitBtn.addEventListener('click', stopwatchObj.splitTime.bind(stopwatchObj));
  },

  /**
   * Function substitutes class oldClass for newClass.
   *
   * @param {XML|Node} element whose class will be substituted
   * @param {string} oldClass class which will be removed
   * @param {string} newClass class which will be added instead of oldClass
   */
  changeClass : function(element, oldClass, newClass) {
    "use strict";
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  }
};

/**
 * This object is created to manipulate with stopwatch.
 *
 * @type {{START_PAUSE_BTN_CLASS: string,
 *         RESET_BTN_CLASS: string,
 *         SPLIT_BTN_CLASS: string,
 *         STOPWATCH_BOARD_CLASS: string,
 *         INITIAL_BOARD_STATE: string,
 *         START_STATE_BTN_CLASS: string,
 *         STOP_STATE_BTN_CLASS: string,
 *         SPLIT_TABLE_CLASS: string,
 *         START_BTN_TITLE: string,
 *         STOP_BTN_TITLE: string,
 *         isStarted: boolean,
 *         currentTimerValue: number,
 *         timerId: number,
 *         splits: number,
 *         timer: null,
 *         startPauseBtn: null,
 *         resetBtn: null,
 *         splitBtn: null,
 *         splitTable: null,
 *
 *         startPauseStopwatch: stopwatch.startPauseStopwatch,
 *         resetStopwatch: stopwatch.resetStopwatch,
 *         splitTime: stopwatch.splitTime,
 *         updateTimer: stopwatch.updateTimer}}
 */
var stopwatch = {

  START_PAUSE_BTN_CLASS : 'stopwatch_launch_btn',
  RESET_BTN_CLASS : 'stopwatch_reset_btn',
  SPLIT_BTN_CLASS : 'stopwatch_split_btn',
  STOPWATCH_BOARD_CLASS : 'stopwatch_board',
  INITIAL_BOARD_STATE : '00:00:00.000',
  START_STATE_BTN_CLASS : 'btn-success',
  STOP_STATE_BTN_CLASS : 'btn-danger',
  SPLIT_TABLE_CLASS : 'stopwatch_split',

  START_BTN_TITLE : 'Start',
  STOP_BTN_TITLE : 'Stop',

  isStarted : false,
  currentTimerValue : 0,
  timerId : 0,
  splits : 0,

  timer : null,
  startPauseBtn : null,
  resetBtn : null,
  splitBtn : null,
  splitTable : null,

  /**
   * Function switches state of stopwatch. It can be started or stopped.
   */
  startPauseStopwatch : function() {
    "use strict";
    if (!this.isStarted) {
      this.timerId = setInterval(this.updateTimer.bind(this), 23);
      helper.changeClass(this.startPauseBtn, this.START_STATE_BTN_CLASS, this.STOP_STATE_BTN_CLASS);
      this.startPauseBtn.innerHTML = this.STOP_BTN_TITLE;
    } else {
      clearInterval(this.timerId);
      helper.changeClass(this.startPauseBtn, this.STOP_STATE_BTN_CLASS, this.START_STATE_BTN_CLASS);
      this.startPauseBtn.innerHTML = this.START_BTN_TITLE;
      if (this.currentTimerValue) {
        ++this.splits;
        this.splitTable.innerHTML = this.splitTable.innerHTML + '<tr><td>' + this.splits + '</td><td>' + 'STOP' + '</td><td>' + this.timer.innerHTML + '</td></tr>';
      }
    }
    this.isStarted = !this.isStarted;
  },

  /**
   * Function resets stopwatch.
   */
  resetStopwatch : function() {
    "use strict";
    clearInterval(this.timerId);
    this.timer.innerHTML = this.INITIAL_BOARD_STATE;
    this.isStarted = !this.isStarted;
    this.currentTimerValue = 0;
    helper.changeClass(this.startPauseBtn, this.STOP_STATE_BTN_CLASS, this.START_STATE_BTN_CLASS);
    this.startPauseBtn.innerHTML = this.START_BTN_TITLE;
    this.splitTable.innerHTML = '';
    this.splits = 0;
  },

  /**
   * Function splits timer every time the 'Split' button is pressed and timer is in running mode.
   */
  splitTime : function() {
    "use strict";
    if (this.isStarted) {
      ++this.splits;
      this.splitTable.innerHTML = this.splitTable.innerHTML + '<tr><td>' + this.splits + '</td><td>' + 'SPLIT' + '</td><td>' + this.timer.innerHTML + '</td></tr>';
    }
  },

  /**
   * Function updated stopwatch in the DOM.
   */
  updateTimer : function() {
    "use strict";
    this.currentTimerValue = this.currentTimerValue + 23;
    var millisecs = this.currentTimerValue % 1000;
    var seconds = Math.floor(this.currentTimerValue / 1000) % 60;
    var minutes = Math.floor(this.currentTimerValue / (1000 * 60)) % 60;
    var hours = Math.floor(this.currentTimerValue / (1000 * 60 * 60)) % 24;

    this.timer.innerHTML = ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2) + '.' + ('000' + millisecs).slice(-3);
  }
};

helper.findDomElements(stopwatch);
helper.applyEventListeners(stopwatch);
