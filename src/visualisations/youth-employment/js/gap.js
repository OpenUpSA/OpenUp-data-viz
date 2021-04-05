import relatedPosition from './related-position.js'
import * as d3 from 'd3'

export default function (chart) {
  const coords = Array.from(chart.selectAll('.point.active')).map(node => d3.select(node).datum())
  coords.length && d3.select('#gap').style('inset', gapInset) && d3.select('#gap-value').text(Math.round(Math.abs(coords[0].x - coords[1].x) * 100) + '%')
  chart.selectAll('.track').each(eachTrack)

  function gapInset() {
    return `
      0 
      ${100 - Math.max(coords[0].x, coords[1].x) * 100}%
      0
      ${Math.min(coords[0].x, coords[1].x) * 100}%
      `
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
      }
      
      function appendLine(node) {
        node.append('svg')
          .attr('width', 0)
          .attr('height', '100%')
          .append('line')
            .attr('x1', '0.5')
            .attr('y1', '0')
            .attr('x2', '0.5')
            .attr('y2', '100%')
      }
      
      function gapUpdate(update) {
        update.attr('data-value', d => Math.round(d.x * 100) + '%')
          .style('inset', d => position(d, track.node()))
      }

      function position (d, parent) {
        return trackIndex > 0 
          ? `0 auto ${100 - d.gapY / parent.offsetHeight * 100}% ${d.gapX / parent.offsetWidth * 100}%`
          : `${d.gapY / parent.offsetHeight * 100}% auto 0 ${d.gapX / parent.offsetWidth * 100}%`
      }
  }
}
