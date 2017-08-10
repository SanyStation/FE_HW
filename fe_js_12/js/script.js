(function ($) {
  "use strict";
  
  $(function() {
    var templateHtml = $('#item_tmpl').html();
    var data = {
      fullName : 'Гадя Петрович Хренова',
      job : 'Актёр',
      reasonsTitle : 'Хочу учить фронтенд по тому, что:',
      reasons : ['Хочу', 'Учить', 'Фронтенд'],
      contactsTitle : 'Мой контактный телефон:',
      phoneNumber : '+380999999999',
      profileTitle : 'Мой профиль Вконтакте:',
      profileLink : 'http://vk.com',
      profileName : 'vk.com',
      feedbackTitle : 'Мой фидбек:',
      feedback : 'Если нужно, могу сыграть миниатюру'
    };
    $('body').append(window.tmpl(templateHtml, data));
  });
})(jQuery);