(function ($) {
  "use strict";

  var URL = 'https://api.tenor.com/v1/search';
  var SEARCH_KEY = 'LIVDSRZULELA';

  var data = {};
  var colSizes = [0, 0, 0];
  var query = '';
  var tenorConverter = new TenorConverter();

  /**
   * This is abstract class provides common functionality for iterating through response data.
   * It is designed to be inherited by implementation classes.
   *
   * @constructor
   */
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

  /**
   * This class is an implementation of parent class 'Converter'.
   * It's designed to convert response data from 'tenor.com' web-site.
   *
   * @constructor
   */
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
    this.searchData = function(dataContainer, query, position, callback) {
      var self = this;
      $.getJSON(URL + '?key=' + SEARCH_KEY + '&q=' + query + '&limit=21' + (position > 0 ? '&pos=' + position : ''), function (data) {
        dataContainer.nextPosition = data.next;
        dataContainer.results = self.processData(data.results);
        callback();
      });
    };
  }

  /**
   * This function is created to update the screen with new portion of data.
   * It puts every new object into the shortest column to balance between columns.
   *
   * @param {Object} data - contains converted data to present it on the screen
   */
  function updateView(data) {
    $.each(data.results, function(i, val) {
      var $a = $('<a/>', {
        href: val.itemurl
      }).addClass('item');

      var minColumn = getMinColumn(colSizes);
      $a.appendTo($('.col' + (minColumn + 1)));

      $('<img/>', {
        src: val.preview
      }).addClass('item-img').appendTo($a).css({
        width: '290px'
      }).on('mouseover', function() {
        $(this).attr('src', val.url);
      }).on('mouseleave', function() {
        $(this).attr('src', val.preview);
      });

      colSizes[minColumn] += val.height + 10; // +10px margin (top + bottom)
    });
  }

  /**
   * This is the help function. It uses to finde the shortest column among all the columns.
   * It's used by column balancer (function 'updateView').
   *
   * @param {Array.<number>} columns - heights of columns
   * @returns {number} - the shortest column's index
   */
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

  /**
   * This function gets query from input search field,
   * clears screen and shows returned data from external system.
   */
  function doSearch() {
    query = $('.search-field').val();
    tenorConverter.searchData(data, query, 0, function() {
      $('.col1').empty();
      $('.col2').empty();
      $('.col3').empty();
      updateView(data);
    });
  }

  /**
   * This function is designed to do animation before presenting search response data.
   */
  function animateSearch() {
    var self = this;
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
    $(self).unbind('click', animateSearch);

    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() === $(document).height()) {
        tenorConverter.searchData(data, query, data.nextPosition, function() {
          updateView(data);
        });
      }
    });
  }

  $(function() {

    $('.search-button')
      .bind('click', animateSearch)
      .bind('click', doSearch);

    $(document).keypress(function(e) {
      if(e.which === 13) {
        animateSearch();
        doSearch();
      }
    });
  });
})(jQuery);