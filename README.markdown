Continuous Scrolling
====================

Description
-----------
Allows a container or window to automatically load additional content as
the user scrolls down.

License
-------
Licensed under the MIT: http://www.opensource.org/licenses/mit-license.php

Usage
-----
Starting page and page counts are based on data-* attributes on the target
element (e.g., data-current-page="1", data-total-pages="10"):

<pre>
   <div class="container">
     <ul class="content" data-current-page="1" data-total-pages="10">
       <li>Item 1</li>
       <li>Item 2</li>
       <li>Item 3</li>
       <li>Item 4</li>
       <li>Item 5</li>
     </ul>
   </div> 
   <div class="loader" style="display:none">
     <img src="/images/loading.gif">
   </div>
   <div class="error" style="display:none">
     There was an error loading the content. 
     <a href="javascript:$('ul.content').continuous('retry');">Try again</a>.
   </div>

   <script type="text/javascript">
     $('ul.content').continuous({
       area: $('div.container'), // default: window
       url: '/url/to/get/more/data', // default: current location
       loadingIndicator: $('div.loader'), // default: null
       errorIndicator: $('div.error')
     })
   </script>
</pre>

Available options
-----------------
* `area`: The scrollable area that triggers continuous reloading. This is
    really useful when you have a <div> or <ul> with overflow-y:scroll. 
    If you do not include this, it defaults to the window object which 
    watches the scroll events for the whole page.
* `url`: The URL that will be fetched (GET) to retrieve more content. The 
    continuous plugin will automatically append a page parameter with the
    current page.
* `loadingIndicator`: if non-null this should be a jQuery selected object 
    that responds to .hide() and .show().
* `errorIndicator`: if non-null this should be a jQuery selected object 
    that responds to .hide() and .show() and will be shown in the event
    that getting new content fails.
* `distance`: The distance from the bottom of the scrollable area that 
    triggers a new page, default 270. 
* `afterLoad`: if included, a function that will be called after the 
    successful load of new content.
* `newContent`: if included, a function that will be called on content that 
    is about to be inserted into the container. This is useful for attaching
    handlers to newly added content without needing to resort to $.live().
    for example:
    <pre>
    $('#posts').continuous({
       url: '/url/to/get/more/data', 
       loadingIndicator: $('div.loader'), 
       newContent: function(data) {
         data.find('time').timeago();
       }
     })
     </pre>

Requirements
------------

* [jQuery 1.3+](http://download.jquery.com)

Copyright
---------
Copyright 2010 James Golick
Addtional Copyright 2010 Jeff Rafter

