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

    this.intervalTime = 10;
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
        this.changeInterval(this.intervalTime);
    };


    /**
     * Move current values of the buffer to the chart
     */
    this.movinga = function () {
        let me = this;

        Object.keys(me.values).forEach((key) => {
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
    this.push = function (dataType, value) {
        let me = this;

        // Push a new data point onto the back
        me.values[dataType] = value;
    };


    /**
     * Updates the interval time to a new one
     *
     * @param interval
     * @return {boolean}
     */
    this.changeInterval = function (interval) {
        let me = this;

        // Validate number
        if (!Number.isNumeric(interval)) {
            return false;
        }
        interval = parseInt(interval);

        // Delete old interval
        clearInterval(this.interval);

        // Set new one
        this.interval = setInterval(function () {
            me.movinga();
        }, interval);
    };


    // Launch buffer
    this.init();
}