
export default function (coord, node, threshold = 20) {
  return Array.from(node.selectAll('.point').filter(filterNodes)).reduce((acc, curr) => lesser(curr, acc), 
    { distance: Infinity, point: null }
  ).point

  function lesser (point, acc) {
    const distance = dist(coord, point)
    if (distance < threshold && distance < acc.distance) {
      return { distance, point }
    }
    return acc
  }

  function filterNodes() {
    return Math.abs(coord[0] - this.offsetLeft) <= threshold
  }
}

function dist(coord, point) {
  var coord2 = [point.offsetLeft, point.offsetTop]
  return Math.sqrt((coord[0] - coord2[0]) ** 2 + (coord[1] - coord2[1]) ** 2)
}