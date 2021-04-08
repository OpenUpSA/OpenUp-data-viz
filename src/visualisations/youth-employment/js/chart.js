import * as d3 from 'd3'
import dodge from './dodge.js'
import minMax from './min-max.js'
import closestPoint from './closest-point.js'
import gap from './gap.js'
import ticks from './ticks.js'


class Chart {
  constructor (container, data) {
    this.options = {
      resolution: 60,
      rowHeight: 50,
      pointRadius: 8,
      pointPadding: 2
    }

    this.data = data
    this.chart = d3.select(container)
    this.search = this.chart.select('#search-input')

    this.updateChart(data.default)
    ticks(this.chart)

    this.selectPoint({ GEO_CODE: 'mean' })
  }

  updateChart () {
    this.updateTrack(this.data, this.chart.select('.track.female .track-points'), 'female_youth', 'male_youth')
    this.updateTrack(this.data, this.chart.select('.track.male .track-points'), 'male_youth', 'female_youth')
  }

  updateTrack(d, node, dataField, compareFeld) {
    const x = d => parseFloat(d[dataField])
    var points = dodge(d, this.options.rowHeight, this.options.pointRadius + this.options.pointPadding, this.options.resolution, x)
    const { min, max } = minMax(points, dataField, compareFeld)

    points = addMeanPoint(points)

    node.style('height', this.options.rowHeight + 'px')
      .on('mousemove', event => {
        const point = closestPoint(d3.pointer(event), node, this.options.pointRadius)
        this.selectPoint(point && d3.select(point).datum())
      })
      .on('mouseout', () => this.selectPoint())
      .selectAll('.point')
      .data(points)
      .join('div')
        .classed('point', true)
        .classed('mean', d => d.mean)
        .classed('min', d => d.GEO_CODE === min.GEO_CODE)
        .classed('max', d => d.GEO_CODE === max.GEO_CODE)
        .style('left', d => d.x * 100 + '%')
        .style('top', d => d.y + 'px')
        .style('width', this.options.pointRadius * 2 + 'px')
        .style('height', this.options.pointRadius * 2 + 'px')
        .attr('data-group', d => d.group)
        .attr('data-tooltip', d => d.name)

    function addMeanPoint(points) {
      return points.concat([{ x: d3.mean(points, d => d[dataField]), y: 0, mean: true, GEO_CODE: 'mean' }])
    }
  }

  selectPoint (point) {
    this.chart.classed('selected', point)
    gap(this.chart, point && point.GEO_CODE)
  }
}

export default Chart