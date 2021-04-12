export default function (node, target, position) {
  var [x, y] = position || [0, 0]

  return [
    x + node.getBoundingClientRect().left - target.getBoundingClientRect().left,
    y + node.getBoundingClientRect().top - target.getBoundingClientRect().top,
  ]
}
