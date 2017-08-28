(function ($) {
  "use strict";

  var URL = 'https://api.tenor.com/v1/search';
  var SEARCH_KEY = 'LIVDSRZULELA';

  var data = {};
  var colSizes = [0, 0, 0];
  var query = '';

  function Converter() {
    this.processItem = function(item) {
      throw 'Should be overridden by children classes';
    };
    this.processData = function(data) {
      var result = [];
      if (data) {
        for (var i = 0; i < data.length; ++i) {
          result.push(this.extractItem(data[i]));
        }
        return result;
      } else {
        window.console.warn('Bad response');
      }
    };
  }

  function TenorConverter() {
    Converter.call(this);
    this.extractItem = function(item) {
      return {
        title: item.title,
        tags: item.tags,
        preview: item.media[0].gif.preview,
        url: item.media[0].gif.url,
        width: item.media[0].gif.dims[0],
        height: item.media[0].gif.dims[1],
        itemurl: item.itemurl
      };
    };
  }

  function tenorSearchData(dataContainer, query, position, callback) {
    $.getJSON(URL + '?key=' + SEARCH_KEY + '&q=' + query + '&limit=21' + (position > 0 ? '&pos=' + position : ''), function (data) {
      dataContainer.nextPosition = data.next;
      dataContainer.results = new TenorConverter().processData(data.results);
      callback();
    });
  }

  function updateView(data) {
    $.each(data.results, function(i, val) {
      var $a = $('<a/>', {
        href: val.itemurl
      }).addClass('item');

      var minColumn = getMinColumn(colSizes);
      $a.appendTo($('.col' + (minColumn + 1)));

      $('<img/>', {
        src: val.preview
      }).appendTo($a).css({
        width: '290px'
      }).on('mouseover', function() {
        $(this).attr('src', val.url);
      }).on('mouseleave', function() {
        $(this).attr('src', val.preview);
      });

      colSizes[minColumn] += val.height + 10; // +10px margin (top + bottom)
    });
  }

  function getMinColumn(columns) {
    if (!columns.length) {
      return -1;
    }
    var min = columns[0];
    var index = 0;
    for (var i = 1; i < columns.length; ++i) {
      if (columns[i] < min) {
        min = columns[i];
        index = i;
      }
    }
    return index;
  }

  function doSearch() {
    query = $('.search-field').val();
    tenorSearchData(data, query, data.nextPosition, function() {
      $('.col1').empty();
      $('.col2').empty();
      $('.col3').empty();
      updateView(data);
    });
  }

  $(function() {

    var searchAnimation = function() {
      $('.search-button').animate({
        'opacity': '0'
      }).promise().done(function() {
        $('.search-field').animate({
          'margin-top': '0px',
          'margin-bottom': '0px',
          'opacity': '0'
        }).animate({
          'width': '0px'
        }).promise().done(function() {
          var $searchForm = $('.search-form');
          $searchForm.css({
            'width': '268px'
          }).animate({
            'margin-top': '20px'
          }, 500).animate({
            'margin-left': '-15px'
          }, 500).promise().done(function() {
            $('.logo').animate({
              'margin-left': '15px',
              'width': '103px'
            });
            $(this).animate({
              'width': '103px'
            }).promise().done(function() {
              $(this).css({
                'flex-direction': 'row',
                'align-items': 'normal',
                'background-color': 'rgb(250, 250, 250)'
              }).animate({
                'width': '900px',
                'margin-bottom': '15px'
              });
              $('.search-field').animate({
                'margin-left': '20px',
                'width': '100%',
                'opacity': '1'
              });
              $('.search-button').animate({
                'margin-left': '10px',
                'opacity': '1'
              });
              $('html').css({
                'overflow': 'visible'
              });
              $('body').css({
                'overflow': 'visible'
              });
              $('.search-result').css('display', 'flex');
            });
          });
        });
      });
      $(this).unbind('click', searchAnimation);

      $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() === $(document).height()) {
          tenorSearchData(data, query, data.nextPosition, function() {
            updateView(data);
          });
        }
      });
    };

    $('.search-button')
      .bind('click', searchAnimation)
      .bind('click', doSearch);

    $(document).keypress(function(e) {
      if(e.which === 13) {
        searchAnimation();
        doSearch();
      }
    });
  });
})(jQuery);