export default function (chart) {
  const numTicks = 6
  chart
    .select('#plot')
    .selectAll('.tick')
    .data(Array(numTicks))
    .join('i')
    .lower()
    .attr('class', 'tick')
    .attr('data-text', (d, i) => Math.round((i / (numTicks - 1)) * 100) + '%')
    .style('left', (d, i) => (i / (numTicks - 1)) * 100 + '%')
}
