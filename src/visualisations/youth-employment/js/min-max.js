export default function (points, field1, field2) {
  return points.reduce((acc, curr) => {
    acc.min = !acc.min || diff(acc.min) > diff(curr) ? curr : acc.min
    acc.max = !acc.max || diff(acc.max) < diff(curr) ? curr : acc.max
    return acc
  }, { min: null, max: null })

  function diff(value) {
    return Math.abs(parseFloat(value[field1]) - parseFloat(value[field2]))
  }
}