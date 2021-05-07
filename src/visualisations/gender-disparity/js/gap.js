import relatedPosition from './related-position.js'
import * as d3 from 'd3'

export default function (chart, geoCode, duration) {
  const activePoints = chart
    .selectAll('.track')
    .nodes()
    .reduce(chartReducer, [])

  function chartReducer(acc, curr, index) {
    const point = Array.from(curr.querySelectorAll('.point')).find(
      (el) => el.__data__.GEO_CODE === geoCode
    )

    updateTrack(curr, point, index)

    if (point) {
      acc.push(convertPoint(point, curr))
    }

    return acc
  }

  d3.select('#gap-track')
    .selectAll('#gap')
    .data(activePoints.length < 2 ? [] : [activePoints])
    .join(
      (enter) =>
        enter
          .append('div')
          .attr('id', 'gap')
          .call((gap) =>
            gap
              .append('div')
              .attr('id', 'gap-value')
              .classed('annotation', true)
          )
          .call((gap) => gapUpdate(gap, 0)),
      (update) => gapUpdate(update, duration),
      (exit) => exit.remove()
    )

  function gapUpdate(node, duration) {
    node
      .transition()
      .duration(duration)
      .style('left', (d) => `${Math.min(d[0].gapX, d[1].gapX) * 100}%`)
      .style('right', (d) => `${100 - Math.max(d[0].gapX, d[1].gapX) * 100}%`)
      .select('#gap-value')
      .on('start', function () {
        this.__start = this.__textValue || 0
      })
      .textTween(
        (d) =>
          function (t) {
            const value = Math.abs(
              Math.round(d[0].x * 100) - Math.round(d[1].x * 100)
            )
            this.__textValue = Math.round(
              this.__start + (value - this.__start) * t
            )
            return this.__textValue + '%'
          }
      )
  }

  function convertPoint(point, parent) {
    const [gapX, gapY] = relatedPosition(point.parentNode, parent, [
      0,
      point.__data__.y,
    ])
    return Object.assign(
      { gapX: point.__data__.x, gapY: gapY / parent.offsetHeight },
      d3.select(point).datum()
    )
  }

  function updateTrack(track, point, trackIndex) {
    d3.select(track)
      .selectAll('.gap-edge')
      .data(point ? [convertPoint(point, track)] : [])
      .join(
        gapEnter,
        (update) => gapUpdate(update, duration),
        (exit) => exit.remove()
      )

    function gapEnter(enter) {
      enter
        .append('div')
        .classed('gap-edge', true)
        .call(appendChildren)
        .call((selection) => gapUpdate(selection, 0))
    }

    function appendChildren(node) {
      node.append('span').classed('annotation', true)
    }

    function gapUpdate(update, duration) {
      update
        .attr('data-name', (d) => d.name)
        .classed('mean', (d) => d.mean)
        .each(function (d) {
          d3.select(this)
            .transition()
            .duration(duration)
            .call((node) => position(node, d))
            .select('span')
            .on('start', function () {
              this.__start = this.__textValue || 0
            })
            .textTween(
              (d) =>
                function (t) {
                  const value = Math.round(d.x * 100)
                  this.__textValue = Math.round(
                    this.__start + (value - this.__start) * t
                  )
                  return this.__textValue + '%'
                }
            )
        })
    }

    function position(node, d) {
      if (trackIndex > 0) {
        node
          .style('right', 'auto')
          .style('top', `0%`)
          .style('bottom', `${100 - d.gapY * 100}%`)
          .style('left', `${d.gapX * 100}%`)
      } else {
        node
          .style('right', 'auto')
          .style('bottom', `0%`)
          .style('top', `${d.gapY * 100}%`)
          .style('left', `${d.gapX * 100}%`)
      }
    }
  }
}
