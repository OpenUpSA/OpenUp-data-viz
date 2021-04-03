import * as d3 from 'd3'
import dodge from './dodge.js'
import minMax from './min-max.js'
import closestPoint from './closest-point.js'
import * as data from '/data/unemployment.json'

(function () {
  const RESOLUTION = 60
  const ROW_HEIGHT = 50
  const POINT_RADIUS = 8
  const POINT_PADDING = 2
  const chart = d3.select('#chart')

  updateChart(data.default)

  function updateChart(d) {
    updateTrack(chart.select('#female .track'), 'female_youth', 'male_youth')
    updateTrack(chart.select('#male .track'), 'male_youth', 'female_youth')

    function interact(point) {
      chart.classed('selected', point)
      select(point && d3.select(point).datum())
    }

    function select (d) {
      chart.selectAll('.point')
        .classed('active', d2 => d && (d2.GEO_CODE === d.GEO_CODE))
    }

    function updateTrack(node, dataField, compareFeld) {
      const x = d => parseFloat(d[dataField])
      const points = dodge(d, ROW_HEIGHT, POINT_RADIUS + POINT_PADDING, RESOLUTION, x)
      const { min, max } = minMax(points, dataField, compareFeld)
  
      node.style('height', ROW_HEIGHT + 'px')
        .on('mousemove', mouseMove)
        .on('mouseout', () => interact())
        .selectAll('.point')
        .data(points)
        .join('div')
          .classed('point', true)
          .classed('min', d => d.GEO_CODE === min.GEO_CODE)
          .classed('max', d => d.GEO_CODE === max.GEO_CODE)
          .style('left', d => d.x * 100 + '%')
          .style('top', d => d.y + 'px')
          .style('width', POINT_RADIUS * 2 + 'px')
          .style('height', POINT_RADIUS * 2 + 'px')
          .attr('data-group', d => d.group)

      function mouseMove(event) {
        interact(closestPoint(d3.pointer(event), d3.select(this), POINT_RADIUS))
      }
    }
  }
})()