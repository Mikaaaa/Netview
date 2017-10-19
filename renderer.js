// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote} = require('electron')
const {ipcRenderer} = require('electron')
var win = remote.getCurrentWindow()
const webview = document.querySelector('webview')
const $ = require('jQuery')
const TabGroup = require("electron-tabs")
let tabGroup = new TabGroup()


/**
 * var
 */
const views = document.querySelector('#views')
const addTab = document.querySelector('#add')
const menuPrincipal = document.querySelector('.dropdown')
const LblUrl =document.querySelector('#LblUrl')

var urlTxtTemp
var navOpen = false
var audioON = false
var audioIcon ='volume_up'
var tabIco
/* ---#####################-----UI----###################-----*/


$( "#close" ).click(function() {
  win.close()
})
$( "#minimize" ).click(function() {
  win.minimize()
})
$( "#maximize" ).click(function() {
	win.isMaximized() ? win.unmaximize() : win.maximize()
})
$('#menu').click(function() {
     menuPrincipal.classList.toggle('active')
})
$('.closebtn').click(function() {
  closeNav()
})
$('#starter').attr( "src", "src/index.html" )
$(function() {

  $('#urlTxt').bind('keypress', function(e) {
    if(e.keyCode==13){
      navigateTo(document.querySelector('#urlTxt').value)
      $('#reload').innerHTML = "refresh"
      $('#ProgressBar').attr('style','display:none')
      LblUrl.innerHTML =webview.getTitle()
      webview.focus()
    }
  })
  $('tab-0 a').click(function () {
    alert('trest')
  })
  $('#audioIcon').click(function() {
    console.log('audio')
      webview.setAudioMuted(!webview.isAudioMuted())
      if (webview.isAudioMuted()) {
        audioIcon = "volume_off"
      }
      else {
        audioIcon = "volume_up"
      }
  })
  webview.onclick = function() {
    LblUrl.innerHTML =webview.getTitle()
    webview.focus()
    setTimeout(function() {
      LblUrl.innerHTML =webview.getTitle()
      webview.focus()
    }, 5000);
  }
  webview.onchange = function() {
    LblUrl.innerHTML =webview.getTitle()
    webview.focus()
  }

  webview.addEventListener('did-start-loading', function() {
    $('#ProgressBar').attr('style', 'display:visible')
    $('#reload').innerHTML = "close"
  })
  webview.addEventListener('did-stop-loading' , function() {
    LblUrl.innerHTML = webview.getTitle()
    $('#ProgressBar').attr('style', 'display:none')
    $('#reload').innerHTML = "refresh"
  })
  webview.addEventListener('enter-html-full-screen' , function() {
    $('nav').addClass('hide')
    $('.chip').addClass('hide')
    $('webview').attr('style', 'top:0px')
  })
  webview.addEventListener('leave-html-full-screen' , function() {
    $('webview').attr('style', '')
    $('nav').removeClass('hide')
    $('.chip').removeClass('hide')
  })
  webview.addEventListener('page-title-updated' , function() {
    LblUrl.innerHTML = webview.getTitle()
  })
  webview.addEventListener('page-favicon-updated' , function(tabUrl) {
    tabIco = tabUrl["favicons"][0]
    $('.tab-0').html('')
    $('.tab-0').html('<img src="'+tabUrl["favicons"][0]+'" alt="Contact Person">')
    return
  })
  webview.addEventListener('media-started-playing' , function() {
    audioON = true
    $('.tab-0').html('')
    $('.tab-0').html('<img src="'+tabIco+'" alt="Contact Person">')
  })
  webview.addEventListener('media-paused' , function() {
    audioON = false
    $('.tab-0').html('')
    $('.tab-0').html('<img src="'+tabIco+'" alt="Contact Person">')
  })
  $('#urlTxt').focusout(function() {
    document.querySelector('#urlTxt').value = ""
    LblUrl.innerHTML = webview.getTitle()
  })
})

addTab.onclick = function () {
  tabGroup.addTab({
      title: "Google",
      src: "http://google.com",
      visible: true
  })
}

/**
* charge le contenu du chip
* @return {[type]} [description]
*/
function tabLoad() {
  $('.tab-0').html('')
  $('.tab-0').html('<img src="'+tabIco+'" alt="Contact Person" onmouseover="tabLoad()"><i onmouseover="tabLoad()" id="CloseTab" class="close material-icons">close</i>'+getAudioIcon()+'&nbsp;&nbsp;&nbsp;'+webview.getTitle()+'')
  setTimeout(function () {
    emptyTab()
  }, 5000);
}

/**
* vide le contenu du chip
* @return {[type]} [description]
*/
function emptyTab() {
  $('.tab-0').html('')
  $('.tab-0').html('<img src="'+tabIco+'" alt="Contact Person">')
}
document.querySelector('webview').onclick = function() {
    LblUrl.innerHTML = urlTxtTemp;
    document.querySelector('#urlTxt').value = webview.getURL();
    document.querySelector('webview').focus();
  }
document.querySelector('#urlTxt').onclick = function() {
	  urlTxtTemp = LblUrl.innerHTML;
    LblUrl.innerHTML = "";
    document.querySelector('#urlTxt').value = webview.getURL();
    document.querySelector('#urlTxt').select();
  }
document.querySelector('#home').onclick = function() {
    navigateTo("www.google.com");
  }
document.querySelector('#back').onclick = function() {
    webview.goBack();
}
document.querySelector('#forward').onclick = function() {
	webview.goForward();
}
document.querySelector('#reload').onclick = function() {
	if (webview.isLoading()) {
      webview.stop();
    } else {
      webview.reload();
    }
}

function navigateTo(url) {
  document.querySelector('#urlTxt').value = "";
  if (url.includes("http://") || url.includes("https://")) {
    document.querySelector('webview').src = url;
  }
  else if (url.includes(".")) {
    document.querySelector('webview').src = "http://"+url;
  }
  else {
      document.querySelector('webview').src = "https://google.com/search?q="+url;
    }
  }

function openNav() {
    document.getElementById("mySidenav").style.width = "250px"
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0"
}
function getAudioIcon() {
  if (audioON) {
    return '<i id="audioIcon" class="close material-icons">'+AudioIcon()+'</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
  }
  else {
    return ''
  }
}
function AudioIcon() {
  return audioIcon
}
function getTabIco() {
  return tabIco
}
