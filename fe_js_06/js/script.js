
var helper = {

  findDomElements : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn = document.querySelector('.' + stopwatchObj.START_PAUSE_BTN_CLASS);
    stopwatchObj.resetBtn = document.querySelector('.' + stopwatchObj.RESET_BTN_CLASS);
    stopwatchObj.splitBtn = document.querySelector('.' + stopwatchObj.SPLIT_BTN_CLASS);
    stopwatchObj.timer = document.querySelector('.' + stopwatchObj.STOPWATCH_BOARD_CLASS);
    stopwatchObj.splitTable = document.querySelector('.' + stopwatchObj.SPLIT_TABLE_CLASS + ' tbody');
  },

  applyEventListeners : function(stopwatchObj) {
    "use strict";
    stopwatchObj.startPauseBtn.addEventListener('click', stopwatchObj.startPauseStopwatch.bind(stopwatchObj));
    stopwatchObj.resetBtn.addEventListener('click', stopwatchObj.resetStopwatch.bind(stopwatchObj));
    stopwatchObj.splitBtn.addEventListener('click', stopwatchObj.splitTime.bind(stopwatchObj));
  },

  changeClass : function(element, oldClass, newClass) {
    "use strict";
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  }
};

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

  splitTime : function() {
    "use strict";
    if (this.isStarted) {
      ++this.splits;
      this.splitTable.innerHTML = this.splitTable.innerHTML + '<tr><td>' + this.splits + '</td><td>' + 'SPLIT' + '</td><td>' + this.timer.innerHTML + '</td></tr>';
    }
  },

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
