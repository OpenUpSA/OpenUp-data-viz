export default class {
  constructor (selector, handler) {
    this.node = document.querySelector(selector)
    this.options = this.node.querySelectorAll('span')
    this.handler = handler

    this.options.forEach(node => {
      node.addEventListener('click', e => this.select(e.currentTarget.dataset.value))
    })
  }

  select (value) {
    this.options.forEach(node => {
      node.classList.toggle('active', node.dataset.value === value)
    })

    this.handler && this.handler('select', value)
  }
}