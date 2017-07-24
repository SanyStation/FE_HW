
var helper = {

  findDomElements : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn = document.querySelector('.' + stopwatchObj.START_PAUSE_BTN_CLASS);
    stopwatchObj.clearBtn = document.querySelector('.' + stopwatchObj.CLEAR_BTN_CLASS);
    stopwatchObj.timer = document.querySelector('.' + stopwatchObj.STOPWATCH_BOARD_CLASS);
  },

  applyEventListeners : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn.addEventListener('click', stopwatchObj.startPauseStopwatch.bind(stopwatchObj));
    stopwatchObj.clearBtn.addEventListener('click', stopwatchObj.clearStopwatch.bind(stopwatchObj));
  },

  changeClass : function(element, oldClass, newClass) {
    "use strict";
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  }
};

var stopwatch = {

  START_PAUSE_BTN_CLASS : 'stopwatch_launch_btn',
  CLEAR_BTN_CLASS : 'stopwatch_clear_btn',
  STOPWATCH_BOARD_CLASS : 'stopwatch_board',
  INITIAL_BOARD_STATE : '00:00:00.000',
  START_STATE_BTN_CLASS : 'btn-success',
  PAUSE_STATE_BTN_CLASS : 'btn-warning',
  START_BTN_TITLE : 'Start',
  PAUSE_BTN_TITLE : 'Pause',

  isStarted : false,
  currentTimerValue : 0,
  timerId : 0,

  timer : null,
  startPauseBtn : null,
  clearBtn : null,

  startPauseStopwatch : function() {
    "use strict";
    if (!this.isStarted) {
      this.timerId = setInterval(this.updateTimer.bind(this), 3);
      helper.changeClass(this.startPauseBtn, this.START_STATE_BTN_CLASS, this.PAUSE_STATE_BTN_CLASS);
      this.startPauseBtn.innerHTML = this.PAUSE_BTN_TITLE;
    } else {
      clearInterval(this.timerId);
      helper.changeClass(this.startPauseBtn, this.PAUSE_STATE_BTN_CLASS, this.START_STATE_BTN_CLASS);
      this.startPauseBtn.innerHTML = this.START_BTN_TITLE;
    }
    this.isStarted = !this.isStarted;
  },

  clearStopwatch : function() {
    "use strict";
    clearInterval(this.timerId);
    this.timer.innerHTML = this.INITIAL_BOARD_STATE;
    this.isStarted = !this.isStarted;
    this.currentTimerValue = 0;
    helper.changeClass(this.startPauseBtn, this.PAUSE_STATE_BTN_CLASS, this.START_STATE_BTN_CLASS);
    this.startPauseBtn.innerHTML = this.START_BTN_TITLE;
  },

  updateTimer : function() {
    "use strict";
    this.currentTimerValue = this.currentTimerValue + 3;
    var millisecs = this.currentTimerValue % 1000;
    var seconds = Math.floor(this.currentTimerValue / 1000) % 60;
    var minutes = Math.floor(this.currentTimerValue / (1000 * 60)) % 60;
    var hours = Math.floor(this.currentTimerValue / (1000 * 60 * 60)) % 24;

    this.timer.innerHTML = ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2) + '.' + ('000' + millisecs).slice(-3);
  }
};

helper.findDomElements(stopwatch);
helper.applyEventListeners(stopwatch);
