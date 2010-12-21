/*
 * Continuous (for jQuery)
 * version: 0.3.0 (12/21/2010)
 * @requires jQuery v1.3 or later
 *
 * Examples at http://jeffrafter.github.com/jquery.continuous
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2010 James Golick
 *
 * Additional changes 2010 Jeff Rafter
 *
 * Allows a container or window to automatically load additional content as
 * the user scrolls down.
 *
 * Usage:
 *
 *  <div class="container">
 *    <ul class="content" data-current-page="1" data-total-pages="10">
 *      <li>Item 1</li>
 *      <li>Item 2</li>
 *      <li>Item 3</li>
 *      <li>Item 4</li>
 *      <li>Item 5</li>
 *    </ul>
 *  </div> 
 *  <div class="loader" style="display:none">
 *    <img src="/images/loading.gif">
 *  </div>
 *  <div class="error" style="display:none">
 *    There was an error loading the content. 
 *    <a href="javascript:$('ul.content').continuous('retry');">Try again</a>.
 *  </div>
 *
 *  <script type="text/javascript">
 *    $('ul.content').continuous({
 *      area: $('div.container'), // default: window
 *      url: '/url/to/get/more/data', // default: current location
 *      loadingIndicator: $('div.loader'), // default: null
 *      errorIndicator: $('div.error')
 *    })
 *  </script>
 *
 * Available options:
 *
 *   area: The scrollable area that triggers continuous reloading. This is
 *     really useful when you have a <div> or <ul> with overflow-y:scroll. 
 *     If you do not include this, it defaults to the window object which 
 *     watches the scroll events for the whole page.
 *
 *   url: The URL that will be fetched (GET) to retrieve more content. The 
 *     continuous plugin will automatically append a page parameter with the
 *     current page.
 *
 *   loadingIndicator: if non-null this should be a jQuery selected object 
 *     that responds to .hide() and .show().
 *
 *   errorIndicator: if non-null this should be a jQuery selected object 
 *     that responds to .hide() and .show() and will be shown in the event
 *     that getting new content fails.
 *
 *   distance: The distance from the bottom of the scrollable area that 
 *     triggers a new page, default 270. 
 *
 *   afterLoad: if included, a function that will be called after the 
 *     successful load of new content.
 *
 *   newContent: if included, a function that will be called on content that 
 *     is about to be inserted into the container. This is useful for attaching
 *     handlers to newly added content without needing to resort to $.live().
 *     for example:
 *
 *     $('#posts').continuous({
 *        url: '/url/to/get/more/data', 
 *        loadingIndicator: $('div.loader'), 
 *        newContent: function(data) {
 *          data.find('time').timeago();
 *        }
 *      })
 *
 */
(function($) {
  var defaults = {
    loadingIndicator: null,
    url: window.location.toString(),
    distance: 270,
    area: window
  };

  var Continuous = function(target, userOptions) {
    var options     = {};
    $.extend(options, defaults, userOptions);
    
    var self        = this;
    var container   = $(target);
    var distance    = options.distance;
    var area        = options.area;

    var distanceToBottom = function () {
      if (area === window) 
        return $(document).height() - $(window).scrollTop() - $(window).height()
      else
        return $(area)[0].scrollHeight - $(area).scrollTop() - $(area).height()
    };

    var currentPage = function() {
      return parseInt(container.attr("data-current-page"));
    };

    var totalPages = function() {
      return parseInt(container.attr("data-total-pages"));
    };

    var onLastPage = function() {
      return currentPage() == (totalPages());
    };

    var nextPage = function() { return currentPage() + 1; };

    var setPage = function(page) { container.attr("data-current-page", page); };

    var scrolledFarEnough = function() {
      return distanceToBottom() <= distance;
    };

    var checkAreaCallback = function() {
      if (container.is(".continuous-loading")) { return; }
      if (onLastPage()) { unbindCallback(); return; }
      if (scrolledFarEnough()) { this.load(); }
    };

    var checkAreaForContinuation = function() {
      checkAreaCallback.apply(self);
    };

    var unbindCallback = function() {
      $(area).unbind("scroll resize", checkAreaForContinuation);
    };

    var bindCallback = function() {
      $(area).bind("scroll resize", checkAreaForContinuation);
    };
    
    // Immediately bind
    bindCallback();

    var showLoadingIndicator = function() {
      if (options.loadingIndicator) {
        $(options.loadingIndicator).show();
      }
    };

    var hideLoadingIndicator = function() {
      if (options.loadingIndicator) {
        $(options.loadingIndicator).hide();
      }
    };

    var showErrorIndicator = function() {
      if (options.errorIndicator) {
        $(options.errorIndicator).show();
      }
    };

    var hideErrorIndicator = function() {
      if (options.errorIndicator) {
        $(options.errorIndicator).hide();
      }
    };

    var afterLoad = function() {
      if (options.afterLoad) {
        options.afterLoad.apply(this);
      }
    };

    var newContent = function(data) {
      data = $(data);
      if (options.newContent) {
        options.newContent.apply(this, [data]);
      }
      return data;
    };
    
    var loadSuccess = function(data) {
      setPage(nextPage());
      hideErrorIndicator();
      hideLoadingIndicator();
      data = newContent(data);
      container.removeClass("continuous-loading").append(data);
      afterLoad();
    };
    
    var loadError = function(data) {
      hideLoadingIndicator();
      data = newContent(data);
      container.removeClass("continuous-loading").append(data);
      showErrorIndicator();      
    };

    this.load = function() {
      container.addClass("continuous-loading");
      showLoadingIndicator();
      $.ajax({
        url: options.url, 
        data: {page: nextPage()}, 
        success: loadSuccess,
        error: loadError
      }); 
    };
    
    // Fire an initial callback
    checkAreaForContinuation();
  };

  $.fn.continuous = function(options) {
    $.each(this, function(i, e) {
      if (options == "load" || options == "retry") {
        e.continuous.load();
      } else {
        e.continuous = new Continuous(e, options);
      }
    });

    return this;
  };
}(jQuery));