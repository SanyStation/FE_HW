$(function() {
  "use strict";
  var tabId = $('.tabs__list__item--active > .tabs__list__item__link').attr('href');
  var tab = $('#' + tabId);
  tab.show();
  tab.siblings().hide();

  $('.tabs__list__item').click(function(e) {
    e.preventDefault();
    $(this).addClass('tabs__list__item--active');
    $(this).siblings('.tabs__list__item').removeClass('tabs__list__item--active');
    var tabId = $('.tabs__list__item--active > .tabs__list__item__link').attr('href');
    var tab = $('#' + tabId);
    tab.show();
    tab.siblings().hide();
  });
});