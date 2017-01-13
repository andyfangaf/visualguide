function injectCSS() {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('../styles/main.css');
  (document.head||document.documentElement).appendChild(style);
}

const CLASSES = {
  dimmer: 'visualguide-dimmer'
}

const DIMMER_INDEX = 100000

class Cursor {
  constructor() {
    this.x = 0
    this.y = 0
    this.visualguideDimmer;

    document.addEventListener('onmousemove', () => {
      this.updateCursorPosition()
    })

    document.addEventListener('onmouseover', (evt) => {
      console.log(evt.target);
    })

    this.initializeDimmer()
    this.highlightUIcomponents()
    console.log('constructor');
  }

  initializeDimmer() {
    const dimmer = document.createElement('div')
    dimmer.id = CLASSES.dimmer
    dimmer.style.width = `${document.body.scrollWidth}px`
    dimmer.style.height = `${document.body.scrollHeight}px`
    document.body.appendChild(dimmer)
    this.visualguideDimmer = dimmer;
    debugger;
  }

  highlightUIcomponents() {
    const rectToHighlight = document.querySelector('.commit-tease-contributors').getBoundingClientRect()
    const highlightRect = document.createElement('div')

    highlightRect.style.position = 'absolute'
    highlightRect.style.top = `${rectToHighlight.top + window.scrollY}px`
    highlightRect.style.left = `${rectToHighlight.left + window.scrollX}px`
    highlightRect.style.height = `${rectToHighlight.height}px`
    highlightRect.style.width = `${rectToHighlight.width}px`
    highlightRect.classList.add('visualguide-element')

    highlightRect.addEventListener('click', (evt) => {
      console.log(evt);
    })

    this.visualguideDimmer.appendChild(highlightRect)
  }
  updateCursorPosition(evt) {
    this.x = evt.clientX
    this.y = evt.clientY
  }
}

const cursor = new Cursor()
