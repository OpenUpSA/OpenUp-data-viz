export default function (data, height, radius, numCols, x = d => d) {
  const radius2 = radius * 2

  const colsReducer = (acc, curr) => {
    const item = Object.assign({ x:  x(curr) }, curr)
    const group = Math.floor(item.x * numCols)
    acc[group] && acc[group].push(item) || (acc[group] = [item])
    item.group = group
    return acc
  }

  return Object.values(data.reduce(colsReducer, {})).map(items => {
    const space = Math.min(height - radius2, items.length * radius)

    return items.map((value, index) => {
      value.y = (items.length == 1 ? 0 : index / (items.length - 1) * space - space / 2) + height / 2
      return value
    })
  }).flat()
}