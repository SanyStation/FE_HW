(function ($) {
  "use strict";

  $(function() {
    $('.jcarousel').jcarousel();
    
    $('.jcarousel-control-prev')
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .jcarouselControl({
        target: '-=1'
      });

    $('.jcarousel-control-next')
      .on('jcarouselcontrol:active', function() {
        $(this).removeClass('inactive');
      })
      .on('jcarouselcontrol:inactive', function() {
        $(this).addClass('inactive');
      })
      .jcarouselControl({
        target: '+=1'
      });

    $('.jcarousel-pagination')
      .on('jcarouselpagination:active', 'a', function() {
        $(this).addClass('active');
      })
      .on('jcarouselpagination:inactive', 'a', function() {
        $(this).removeClass('active');
      })
      .jcarouselPagination();

    $('select').selectric();

    $('.jquery-check').each(function() {
      changeCheckStart($(this));
    });

    /**
     * Function changes class of checkbox if it isn't disabled
     *
     * @param el input element that was clicked on
     */
    function changeCheck(el) {
      var input = el.find("input").eq(0);

      if (el.attr("class").indexOf("jquery-check--disabled") === -1) {
        if (!input.prop("checked")) {
          el.addClass("jquery-check--checked");
          input.prop("checked", true);
        } else {
          el.removeClass("jquery-check--checked");
          input.prop("checked", false).focus();
        }
      }
    }

    /**
     * Function switches class of checkbox
     *
     * @param el input element that changed its state (from checked to unchecked or vice versa)
     */
    function changeVisualCheck(input) {
      var wrapInput = input.parent();
      if (!input.prop("checked")) {
        wrapInput.removeClass("jquery-check--checked");
      } else {
        wrapInput.addClass("jquery-check--checked");
      }
    }

    /**
     * Function sets initial params for all checkboxes with class 'jquery-check' and
     * creates additional span element to stylize and manipulate checkbox
     *
     * @param el checkbox with class 'jquery-check'
     */
    function changeCheckStart(el) {
      try {
        var checkId = el.attr("id");
        var checkChecked = el.prop("checked");
        var checkDisabled = el.prop("disabled");
        if (checkChecked) {
          el.after("<span class='jquery-check jquery-check--checked'>" +
            "<input type='checkbox' " +
            "id='" + checkId + "' " +
            "checked='" + checkChecked + "'/></span>");
        } else {
          el.after("<span class='jquery-check'>" +
            "<input type='checkbox' " +
            "id='" + checkId + "'/></span>");
        }

        if (checkDisabled) {
          el.next().addClass("jquery-check--disabled");
          el.next().find("input").eq(0).prop("disabled", "disabled");
        }

        el.next().bind("mousedown", function(e) {
          changeCheck($(this));
        });

        el.next().find("input").eq(0).bind("change", function(e) {
          changeVisualCheck($(this));
        });

        el.remove();
      } catch(e) {
        window.console.error('Error', e);
      }
    }
  });
})(jQuery);