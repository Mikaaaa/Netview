// Global lock so we can't open more than once on a tab.
if (typeof may_open_dialog_ui === "undefined")
  may_open_dialog_ui = true;

function top_open_blacklist_ui(options) {
  if (!may_open_dialog_ui)
    return;

  may_open_dialog_ui = false;

  // Get Flash objects out of the way of our UI
  BGcall('emitPageBroadcast', {fn:'send_content_to_back', options:{}});

  load_jquery_ui(function() {
    // If they chose "Block an ad on this page..." ask them to click the ad
    if (options.nothing_clicked)
      rightclicked_item = null;

    // If they right clicked in a frame in Chrome, use the frame instead
    if (options.info && options.info.frameUrl) {
      var frame = $("iframe").filter(function(i, el) {
        return el.src == getUnicodeDomain(options.info.frameUrl);
      });
      if (frame.length == 1)
        rightclicked_item = frame[0];
    }
    if (rightclicked_item && rightclicked_item.nodeName == "BODY")
      rightclicked_item = null;
    //check if we're running on website with a frameset, if so, tell
    //the user we can't run on it.
    if ($("frameset").length >= 1) {
        alert(translate('wizardcantrunonframesets'));
        may_open_dialog_ui = true;
        $(".adblock-ui-stylesheet").remove();
        return;
    }


    BGcall("getSettings", function(settings) {
      var advanced_user = settings.show_advanced_options;
      var blacklist_ui = new BlacklistUi(rightclicked_item, advanced_user);
      blacklist_ui.cancel(function() {
        may_open_dialog_ui = true;
      });
      blacklist_ui.block(function() {
        may_open_dialog_ui = true;
        // In case of frames, reload, as the frame might contain matches too.
        if ($("iframe, frameset, frame").filter(":visible").length > 0)
          document.location.reload();
      });
      blacklist_ui.show();
    });
    bind_enter_click_to_default();
  });
}

// Add style rules hiding the given list of selectors.
function block_list_via_css(selectors) {
  if (!selectors.length)
    return;
  var css_chunk = document.createElement("style");
  css_chunk.type = "text/css";
  // Documents may not have a head
  (document.head || document.documentElement).insertBefore(css_chunk, null);

  function fill_in_css_chunk() {
    if (!css_chunk.sheet) {
      window.setTimeout(fill_in_css_chunk, 0);
      return;
    }
    for (var i = 0; i < selectors.length; i++) {
      var rule = selectors[i] + " { display:none !important; visibility: hidden !important; orphans: 4321 !important; }";
      css_chunk.sheet.insertRule(rule, 0);
    }
  }
  fill_in_css_chunk();
}

//@ sourceURL=/uiscripts/top_open_blacklist_ui.js