import relatedPosition from './related-position.js'
import * as d3 from 'd3'

export default function (chart, geoCode) {
  const activePoints = chart.selectAll('.track')
    .nodes()
    .reduce(chartReducer, [])

  function chartReducer (acc, curr, index) {
    const point = Array.from(curr.querySelectorAll('.point'))
      .find(el => el.__data__.GEO_CODE === geoCode)

    updateTrack(curr, point, index)

    if (point) {
      acc.push(convertPoint(point, curr))
    }
    
    return acc
  }
  
  d3.select('#gap')
    .datum(activePoints)
    .call(node => updateGap(node))

  function updateGap(node) {
    const coords = node.datum()

    if (coords.length < 2) {
      return
    }

    node.style('left', `${Math.min(coords[0].gapX, coords[1].gapX) * 100}%`)
      .style('right', `${100 - Math.max(coords[0].gapX, coords[1].gapX) * 100}%`)
      .select('#gap-value')
      .text(Math.abs(Math.round(coords[0].x * 100) - Math.round(coords[1].x * 100)) + '%')
  }

  function convertPoint(point, parent) {
    const [gapX, gapY] = relatedPosition(point, parent)
    return Object.assign({gapX: gapX / parent.offsetWidth, gapY: gapY / parent.offsetHeight}, d3.select(point).datum())
  }
  
  function updateTrack(track, point, trackIndex) {
    d3.select(track).selectAll('.gap-edge')
      .data(point ? [convertPoint(point, track)] : [])
      .join(
        gapEnter,
        gapUpdate,
        exit => exit.remove()
      )

      function gapEnter (enter) {
        enter.append('div')
          .classed('gap-edge', true)
          .call(appendChildren)
          .call(gapUpdate)
      }
      
      function appendChildren(node) {
        node.append('svg')
          .attr('width', 1)
          .attr('height', '100%')
          .append('line')
            .attr('x1', '0.5')
            .attr('y1', '0')
            .attr('x2', '0.5')
            .attr('y2', '100%')
        node.append('span')
      }
      
      function gapUpdate(update) {
        update.attr('data-name', d => d.name)
          .classed('mean', d => d.mean)
          .each(function (d) {
            d3.select(this)
              .call(node => position(node, d, track))
              .select('span').text(Math.round(d.x * 100) + '%')
          })
      }

      function position(node, d) {
        if (trackIndex > 0) {
          node.style('top', 0)
            .style('right', 'auto')
            .style('bottom', `${100 - d.gapY * 100}%`)
            .style('left', `${d.gapX * 100}%`)
        } else {
          node.style('top', `${d.gapY * 100}%`)
            .style('right', 'auto')
            .style('bottom', `0`)
            .style('left', `${d.gapX * 100}%`)
        }
      }
  }
}
