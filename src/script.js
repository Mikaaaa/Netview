/**
 * Creates a new tab and webview from the
 * user's set home page, and append it to
 * the list of tabs in the sidebar.
 */
function createTab(page = 'https://google.com') {

  removeAllActive()

  // Create new tab
  const newTab = document.createElement('a')
  newTab.className = 'follow '+ webview.getTitle() //id css
  newTab.innerHTML ="<i class='small material-icons'>insert_drive_file</i>"
  newTab.textContent = webview.getTitle()
  document.querySelector('#tabs').appendChild(newTab) //ajoute l'onglet a la liste des onglets

  const newView = document.createElement('webview')
  newView.setAttribute('src', page)
  newView.setAttribute('id', 'webview')
  document.querySelector('#urlTxt').setAttribute('value', page)// set la barre d'adresse
  newView.className = 'active '
  views.appendChild(newView) //ajoute un weview a la liste des views

  console.log('handleTabClick('+newTab+','+newView+')')
  handleTabClick(newTab, newView)
  //resizeTabNames()

}
/**
 * Sets the clicked tab and corresponding view
 * to active.
 *
 * @param newTab
 * @param newView
 */
function handleTabClick(newTab, newView) {
  const closeButtonWidth = 22

  // Handle each tab's clicks separately
  newTab.onclick = event => {

    // Clicked on the x button so close the tab
    if (event.clientX > newTab.offsetWidth - closeButtonWidth) {

      // Handle top tab
      if (newTab.previousSibling) {

        // If you close the current tab, set the one before it to active
        if (newTab.classList.contains('active')) {

          // Tab above this one
          setToActive(newTab.previousSibling, newView.previousSibling)
          console.log('setToActive('+newTab.previousSibling+','+newView.previousSibling+')')
        }
      }

      closeTab(newTab, newView)
    }

    // Tree View goes here
    else if (event.clientX < 15) {
      console.log(event.target)
    }

    // If not closing the tab or selecting more options
    // Then set it to the active tab
    else {
      setToActive(newTab, newView)
    }

  }

}
/**
 * Sets a tab and view's classes to active
 *
 * @param tab
 * @param view
 */
function setToActive(tab, view) {
  removeAllActive()

  tab.classList.remove('active')
  view.classList.remove('hide')
  view.classList.add('active')

}
/**
 * Remove the active class from an element
 */
function removeActive(element) {

  if (element.className === 'active' && element.className != null) {
    element.classList.remove('active')
  }
}
/**
 * Removes all active webviews and tabs
 */
function removeAllActive() {

  // Remove active tabs and views
  Array.prototype.forEach.call(document.querySelector('#tabs').childNodes, (tab, i) => {

    const view = views.childNodes.item(i)
    removeActive(view)
    view.className = 'hide' //ajouter une class

    removeActive(tab)
  })
}
/**
 * Closes the tab passed in and removes the corresponding
 * webview.
 *
 * @param tab
 */
function closeTab(tab, view) {
  console.log('close')
  document.querySelector('#tabs').removeChild(tab)
  views.removeChild(view)
}
