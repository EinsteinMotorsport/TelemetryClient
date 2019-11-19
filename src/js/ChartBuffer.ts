/**
 * Buffer class to pass the unequally received values synchronized
 * in fix intervals to a chart.
 * Different values are sent in different intervals from the server.
 * Each value received from the server overrides the values of its data-type received before,
 * so only the latest value is passed each interval tick.
 *
 * @constructor
 */
import ChartInterface from "./charts/ChartInterface";
import App from "./App";

export default class ChartBuffer {

    interval: NodeJS.Timeout = null;

    values = [];

    /**
     * @type ChartInterface
     */
    chart: ChartInterface = null;


    /**
     * Set a char object to the buffer
     *
     * @param chart ChartInterface
     */
    setChart(chart) {
        let me = this;

        // Set the chart object
        me.chart = chart;

        // Update the sampling time of the buffer
        me.changeInterval(me.chart.getSamplingTime());
    };


    /**
     * Move current values of the buffer to the chart
     */
    movinga() {
        let me = this;

        // Exit if telemetry is not started or there is no connection
        if (!App.getInstance().isWebsocketOpen()) return;

        // Push buffer value to the chart
        Object.keys(me.values).forEach((key: string) => {
            let val = me.values[key];
            this.chart.push(key, val);
        });
    };


    /**
     * Push a value to the buffer
     *
     * @param dataType
     * @param value
     */
    push(dataType, value) {
        let me = this;

        // Push a new data point onto the back
        me.values[dataType] = value;
    };


    /**
     * Updates the interval time to a new one
     *
     * @param samplingTime
     * @return {boolean}
     */
    changeInterval(samplingTime) {
        let me = this;

        // Validate number
        if (!Number.prototype.isNumeric(samplingTime)) {
            return false;
        }
        samplingTime = parseInt(samplingTime);

        // Set the new sampling time to the chart
        me.chart.setSamplingTime(samplingTime);
        
        // Delete old interval
        clearInterval(me.interval);

        // Set new one
        me.interval = setInterval(() => {
            me.movinga();
        }, samplingTime);
    };
}
