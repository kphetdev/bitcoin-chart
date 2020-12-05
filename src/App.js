import React, {Component} from 'react'
import Chart from 'chart.js'
import './App.css'

// get data of last 5 years
const URL = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${new Date().getFullYear()-5}-${('00'+(new Date().getMonth()+1)).slice(-2)}-${('00'+(new Date().getDate())).slice(-2)}&end=${new Date().getFullYear()}-${('00'+(new Date().getMonth()+1)).slice(-2)}-${('00'+(new Date().getDate())).slice(-2)}`

export default class App extends Component {
    state = {
        btcPrices: {}
    }

    componentDidMount() {
        // call this function after a compoment is mounted.
        this.getBTCPrice()
        this.showGraph()
    }

    showGraph() {
        // bitcoin price (bpi) object
        let btcPrices = this.state.btcPrices

        // label array for using in Chart.js
        let tmp_label = []
        // data array for using in Chart.js
        let tmp_data = []
        Object.keys(btcPrices).forEach(d => {
            tmp_label.push(d)
            tmp_data.push(btcPrices[d])
        })

        const canvas = this.refs.myChart
        const ctx = canvas.getContext('2d')

        return new Chart(ctx, {
            // line type chart
            type: 'line',
            data: {
                // adapt tmp_label here
                labels: tmp_label,
                datasets: [{
                    label: 'Last 5 years BTC Price',
                    // adapt tmp_label here
                    data: tmp_data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                elements: {
                    point: {
                        radius: 0
                    }
                },
                tooltips: {
                    callbacks: {
                        // we custom tooltip that will show we point mouse data node in chart
                        label: (tooltipItem, data) => {
                            return 'Price: ' + tooltipItem.yLabel + ' USD';
                        }
                    }
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    }

    getBTCPrice() {
        return fetch(URL)
            .then(r => r.json())
            .then(data => {
                // show response data in console
                this.setState({ btcPrices: data.bpi })
                this.showGraph()
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div className="App">
                <h2>5 years Bitcoin Price History Chart</h2>
                <br/>
                <canvas id="myChart" ref="myChart" />
            </div>
        )
    }

}
