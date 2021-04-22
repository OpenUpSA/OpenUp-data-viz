import * as d3 from 'd3'
import dodge from './dodge.js'
import minMax from './min-max.js'
import closestPoint from './closest-point.js'
import gap from './gap.js'
import ticks from './ticks.js'
import { ALL_UNEMPLOYMENT } from './constants/options.js'

class Chart {
  constructor(container, data) {
    this.options = {
      resolution: 60,
      rowHeight: 50,
      pointRadius: 8,
      pointPadding: 2,
      tweenDuration: 1500,
    }

    this.activePoint = null
    this.selectedPoint = null
    this.data = data
    this.chart = d3.select(container)
    this.ignoreClicks = this.chart.selectAll('.ignore-point-reset').nodes()

    this.chart.on('click', (e) => {
      for (let i = 0; i < this.ignoreClicks.length; i++) {
        if (this.ignoreClicks[i].contains(e.target)) return
      }

      this.lockPoint(null)
    })

    ticks(this.chart)
    this.highlightPoint()
  }

  updateChart(option) {
    this.updateTrack(
      this.data,
      'Average female unemployment',
      this.chart.select('.track.female .track-points'),
      `female_${option}`,
      `male_${option}`
    )
    this.updateTrack(
      this.data,
      'Average male unemployment',
      this.chart.select('.track.male .track-points'),
      `male_${option}`,
      `female_${option}`
    )
    gap(this.chart, this.activePoint.GEO_CODE, this.options.tweenDuration)
    this.chart.classed('annotations-hide', option === ALL_UNEMPLOYMENT)
  }

  updateTrack(d, meanName, node, dataField, compareFeld) {
    const x = (d) => parseFloat(d[dataField])
    const self = this
    var points = dodge(
      d,
      this.options.rowHeight,
      this.options.pointRadius + this.options.pointPadding,
      this.options.resolution,
      x
    )
    const { min, max } = minMax(points, dataField, compareFeld)

    points = addMeanPoint(points, meanName)

    node
      .style('height', this.options.rowHeight + 'px')
      .on('mousemove', (event) => {
        const point = closestPoint(
          d3.pointer(event),
          node,
          this.options.pointRadius
        )
        point && this.highlightPoint(d3.select(point).datum())
      })
      .on('mouseover', () => this.chart.classed('annotations', false))
      .on('mouseout', () => this.highlightPoint())
      .on('click', (event) => {
        const point = closestPoint(
          d3.pointer(event),
          node,
          this.options.pointRadius
        )
        this.lockPoint(point && d3.select(point).datum())
      })
      .selectAll('.point')
      .data(points, d => d.GEO_CODE)
      .join(
        (enter) => enter.append('div').call(initPoints).call(positionPoints),
        (update) =>
          update
            .call(initPoints)
            .transition()
            .duration(this.options.tweenDuration)
            .call(positionPoints)
            .selection(),
        (exit) => exit.remove()
      )

    function initPoints(points) {
      points
        .classed('point', true)
        .style('width', self.options.pointRadius * 2 + 'px')
        .style('height', self.options.pointRadius * 2 + 'px')
        .classed('mean', (d) => d.mean)
        .classed('min', (d) => d.GEO_CODE === min.GEO_CODE)
        .classed('max', (d) => d.GEO_CODE === max.GEO_CODE)
        .classed(
          'annotation',
          (d) => d.GEO_CODE === max.GEO_CODE || d.GEO_CODE === min.GEO_CODE
        )
        .attr('data-group', (d) => d.group)
        .attr('data-tooltip', (d) => d.name)
    }

    function positionPoints(points) {
      points
        .style('left', (d) => d.x * 100 + '%')
        .style('top', (d) => d.y + 'px')
    }

    function addMeanPoint(points, name) {
      return points.concat([
        {
          x: d3.mean(points, (d) => d[dataField]),
          y: 0,
          mean: true,
          GEO_CODE: 'mean',
          name,
        },
      ])
    }
  }

  lockPoint(point) {
    this.selectedPoint = null
    this.highlightPoint(point)
    this.selectedPoint = point
  }

  highlightPoint(point, duration) {
    if (this.selectedPoint) {
      return
    }

    this.chart.classed('selected', point)
    point = point || { GEO_CODE: 'ZA' }
    this.activePoint = point
    this.chart
      .selectAll('.point')
      .classed('active', (d) => point && d.GEO_CODE === point.GEO_CODE)
    gap(this.chart, point && point.GEO_CODE, duration)
  }
}

export default Chart
