import * as d3 from 'd3'

export default class {
  constructor (selector, data, handler) {
    this.data = data
    this.search = d3.select(selector)
    this.input = this.search.select('input')

    console.log(this.input)

    this.input.on('keyup', e => {
      const matches = this.data.map(
          d => d.name.match(new RegExp(e.target.value, 'i'))
        )
        .filter(v => v)
        .sort((a, b) => a.index - b.index)
        .slice(0, 10)
      
      this.search.selectAll('.list').data(matches.length ? [0] : [])
        .join('div')
        .classed('list', true)
        .selectAll('.item').data(matches, d => d.input)
          .join('div')
          .classed('item', true)
          .text(d => d.input)
    })
  }
}