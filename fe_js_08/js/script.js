$(function() {
  "use strict";
  $('.form__pair__field').hover(function() {
    $(this).next('.form__pair__hint').stop(true, true).animate({opacity: "show", left: 285}, "slow");
  }, function() {
    $(this).next('.form__pair__hint').stop(true, true).animate({opacity: "hide", left: 300}, "fast");
  });
});