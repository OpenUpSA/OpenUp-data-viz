import Chart from './chart.js'
import Search from './search.js'
import * as data from '/data/unemployment.json'

(function () {
  const chart = new Chart('#chart', data.default)
  const search = new Search('#search', data.default)
})()