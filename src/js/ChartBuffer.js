/**
 * Buffer class to pass the unequally received values synchronized
 * in fix intervals to a chart.
 * Different values are sent in different intervals from the server.
 * Each value received from the server overrides the values of its data-type received before,
 * so only the latest value is passed each interval tick.
 *
 * @constructor
 */
function ChartBuffer() {

    this.intervalTime = 2000;
    this.interval = null;


    this.values = [];

    /**
     * @type ChartInterface
     */
    this.chart = null;


    /**
     * Init the buffer with interval to move data from the buffer to the chart
     */
    this.init = function () {
        this.interval = setInterval(() => {
            this.movinga();
        }, this.intervalTime)
    };

    // Launch buffer
    this.init();

    /**
     * Move current values of the buffer to the chart
     */
    this.movinga = function () {
        this.values.forEach((val, key) => {
            this.chart.push(key, val);
        });
    };


    /**
     * Push a value to the buffer
     *
     * @param dataTypeId
     * @param value
     */
    this.push = function (dataTypeId, value) {
        let me = this;

        // Push a new data point onto the back
        me.values[dataTypeId] = value;
    };

}