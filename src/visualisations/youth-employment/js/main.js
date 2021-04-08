import Chart from './chart.js'
import Search from './search.js'
import * as data from '/data/unemployment.json'
import { SELECT } from './events.js'

(function () {
  const chart = new Chart('#chart', data.default)
  const search = new Search('#search', data.default, (type, data) => searchHandler(type, data))

  function searchHandler (type, data) {
    if (type === SELECT) {
      chart.selectPoint(data)
    }
  }
})()