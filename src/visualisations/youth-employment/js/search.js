import * as d3 from 'd3'

export default class {
  constructor (selector, data, handler) {
    this.data = data
    this.handler = handler
    this.search = d3.select(selector)
    this.input = this.search.select('input')
    this.input.on('keyup', (e) => this.updateList(e.target.value))
    document.addEventListener('click', e => this.documentClick(e))
  }

  documentClick (e) {
    if (!this.search.node().contains(e.target)) {
      this.updateList()
    }
  }

  updateList (value) {
    const matches = this.data.map(
        d => Object.assign({ match: value && d.name.match(new RegExp(value, 'i')) }, d)
      )
      .filter(v => v.match)
      .sort((a, b) => a.match.index - b.match.index)
      .slice(0, 5)
    
    this.search.selectAll('.list').data(matches.length ? [0] : [])
      .join('div')
      .classed('list', true)
      .selectAll('.item').data(matches, d => d.name)
        .join('div')
        .classed('item', true)
        .text(d => d.name)
        .on('click', (e, d) => {
          this.input.node().value = e.target.textContent
          this.updateList()
          this.handler('select', d)
        })
  }
}