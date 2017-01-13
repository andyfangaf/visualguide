function injectCSS() {
  // remove after I get injection through manifest.css working
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('../styles/main.css');
  (document.head||document.documentElement).appendChild(style);
}

function insertAfter(nodeToInsert, referenceNode) {
  referenceNode.parentNode.insertBefore(nodeToInsert, referenceNode.nextSibling)
}

function levenshtein(a, b) {
  // levenshtein algorithm by @kigiri https://gist.github.com/andrei-m/982927#gistcomment-1931258
  if(!a || !b) return (a || b).length;
  var m = [];
  for(var i = 0; i <= b.length; i++){
      m[i] = [i];
      if(i === 0) continue;
      for(var j = 0; j <= a.length; j++){
          m[0][j] = j;
          if(j === 0) continue;
          m[i][j] = b.charAt(i - 1) == a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(
              m[i-1][j-1] + 1,
              m[i][j-1] + 1,
              m[i-1][j] + 1
          );
      }
  }
  return m[b.length][a.length];
}

const CLASSES = {
  dimmer: 'visualguide-dimmer'
}

const COMPONENTS = ['badge', 'banner', 'breadcrumbs', 'button', 'card', 'collapsible', 'content list', 'country flags', 'description list', 'drag and drop', 'email', 'empty state', 'flash message', 'footer help', 'form', 'frame', 'icon', 'image', 'inline help', 'keyboard keys', 'layout', 'link', 'list', 'modal', 'overlaid', 'page actions', 'popover', 'progress bar', 'scrollable container', 'searchable select', 'spinner', 'stack', 'tab', 'table', 'tag', 'title bar', 'tooltip', 'typography']

class Cursor {
  constructor(componentsData) {
    this.x = 0
    this.y = 0
    this.visualguideDimmer;
    this.initializeDimmer()
    this.componentsData = componentsData

    document.addEventListener('mousemove', (evt) => {
      this.updateCursor(evt)
    })

    // this.highlightUIcomponents()
  }

  updateCursor(evt) {
    this.x = evt.clientX
    this.y = evt.clientY

    const levenshteinIndexes = []
    const containerComponent = evt.target.closest('[class*="ui-"]')

    for (const componentName of COMPONENTS) {
      const index = levenshtein(componentName.toString(), containerComponent.classList[0].toString())
      levenshteinIndexes.push(index)
    }

    const matchingComponentIndex = levenshteinIndexes.indexOf(Math.min(...levenshteinIndexes))
    const matchingComponent = COMPONENTS[matchingComponentIndex]
    console.log(matchingComponent);
  }

  initializeDimmer(hoveredEl) {
    let dimmerWidth, dimmerHeight

    if (hoveredEl) {
      dimmerWidth = document.body.scrollWidth
      dimmerHeight = document.body.scrollHeight
    } else {
      hoveredEl = document.body
      dimmerWidth = 0
      dimmerHeight = 0
    }

    const dimmer = document.createElement('div')
    dimmer.id = CLASSES.dimmer
    dimmer.style.width = `${dimmerWidth}px`
    dimmer.style.height = `${dimmerHeight}px`
    insertAfter(dimmer, hoveredEl)
    this.visualguideDimmer = dimmer;
    return this.visualguideDimmer;
  }

  highlightUIcomponents() {
    const elementsToHighlight = ['.ui-banner', '.btn']
    const rectToHighlight = document.querySelectorAll(elementsToHighlight.join(', '))

    rectToHighlight.forEach(el => {
      const elHighlight = document.createElement('div')
      const elBoundingRect = el.getBoundingClientRect()

      elHighlight.style.position = 'absolute'
      elHighlight.style.top = `${elBoundingRect.top + window.scrollY}px`
      elHighlight.style.left = `${elBoundingRect.left + window.scrollX}px`
      elHighlight.style.height = `${elBoundingRect.height}px`
      elHighlight.style.width = `${elBoundingRect.width}px`
      elHighlight.classList.add('visualguide-element')

      elHighlight.addEventListener('click', (evt) => {
        console.log(evt);
      })

      this.visualguideDimmer.appendChild(elHighlight)
    })
  }

  highlightRect(elToHighlight) {
    const elHighlight = document.createElement('div')
    const elBoundingRect = elToHighlight.getBoundingClientRect()

    elHighlight.style.position = 'absolute'
    elHighlight.style.top = `${elBoundingRect.top + window.scrollY}px`
    elHighlight.style.left = `${elBoundingRect.left + window.scrollX}px`
    elHighlight.style.height = `${elBoundingRect.height}px`
    elHighlight.style.width = `${elBoundingRect.width}px`
    elHighlight.classList.add('visualguide-element')

    elHighlight.addEventListener('click', (evt) => {
      console.log(evt);
    })

    elHighlight.addEventListener('mouseleave', (evt) => {
      console.log(elHighlight);
      evt.target.remove()
      elHighlight.remove()
    })

    this.visualguideDimmer.appendChild(elHighlight)
    return elHighlight
  }

}

const cursor = new Cursor()
