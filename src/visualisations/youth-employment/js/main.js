import Chart from './chart.js'
import Search from './search.js'
import Toggle from './toggle.js'
import * as data from '/data/all_data.json'
import { SELECT } from './constants/events.js'

;(function () {
  const chart = new Chart('#chart', data.default)
  const search = new Search('#search', data.default, (type, data) =>
    searchHandler(type, data)
  )
  const toggle = new Toggle('#youth-toggle', (type, data) =>
    toggleHandler(type, data)
  )

  toggle.select('hiedu')

  function toggleHandler(type, option) {
    if (type === SELECT) {
      chart.updateChart(option)
    }
  }

  function searchHandler(type, data) {
    if (type === SELECT) {
      chart.lockPoint(data)
    }
  }
})()
