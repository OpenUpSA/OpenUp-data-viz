import relatedPosition from './related-position.js'
import * as d3 from 'd3'

export default function (chart, geoCode) {
  const coords = chart.selectAll('.point')
    .classed('active', d => d.GEO_CODE === geoCode)
    .filter(d => d.GEO_CODE === geoCode)
    .nodes()
    .map(node => d3.select(node).datum())
    
  coords.length && d3.select('#gap').call(node => gapStyle(node)) && d3.select('#gap-value').text(Math.round(Math.abs(coords[0].x - coords[1].x) * 100) + '%')
  chart.selectAll('.track').each(eachTrack)

  function gapStyle(node) {
    node.style('left', `${Math.min(coords[0].x, coords[1].x) * 100}%`)
    node.style('right', `${100 - Math.max(coords[0].x, coords[1].x) * 100}%`)
  }
  
  function eachTrack(trackD, trackIndex) {
    const track = d3.select(this)
    const point = track.select('.point.active')

    track.selectAll('.gap-edge')
      .data(point.node() ? [convertPoint(point.node())] : [])
      .join(
        gapEnter,
        gapUpdate,
        exit => exit.remove()
      )

      function convertPoint(point) {
        const [gapX, gapY] = relatedPosition(point, track.node())
        return Object.assign({gapX, gapY}, d3.select(point).datum())
      }
    
      function gapEnter (enter) {
        enter.append('div').call(appendLine)
          .attr('class', 'gap-edge')
          .call(gapUpdate)
      }
      
      function appendLine(node) {
        node.append('svg')
          .attr('width', 1)
          .attr('height', '100%')
          .append('line')
            .attr('x1', '0.5')
            .attr('y1', '0')
            .attr('x2', '0.5')
            .attr('y2', '100%')
      }
      
      function gapUpdate(update) {
        update.attr('data-value', d => Math.round(d.x * 100) + '%')
          .each(function (d) {
            position(d3.select(this), d, track.node())
          })
      }

      function position(node, d, parent) {
        if (trackIndex > 0) {
          node.style('top', 0)
            .style('right', 'auto')
            .style('bottom', `${100 - d.gapY / parent.offsetHeight * 100}%`)
            .style('left', `${d.gapX / parent.offsetWidth * 100}%`)
        } else {
          node.style('top', `${d.gapY / parent.offsetHeight * 100}%`)
            .style('right', 'auto')
            .style('bottom', `0`)
            .style('left', `${d.gapX / parent.offsetWidth * 100}%`)
        }
      }
  }
}
