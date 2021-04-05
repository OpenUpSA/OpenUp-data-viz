
export default function (node, target) {
  var [x, y] = [0, 0]

  while (node !== target) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.parentNode
  }

  return [x, y]
}