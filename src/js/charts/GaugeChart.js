/**
 * GaugeChart with D3.js
 *
 * http://bl.ocks.org/msqr/3202712
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */
function GaugeChart(element) {
    // Svg Element in the document
    this.element = element;

    // Mapping the data-types to the chart
    this.chartMap = [];

    // Chart svg
    this.svg = null;

    // The sampling time of the buffer in ms
    this.samplingTime = 10;

    // Chart configuration
    this.config = {
        size: 250,
        ringInset: 20,
        ringWidth: 20,

        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 70,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: 5,
        labelFormat: d3.format('.0f'),
        labelInset: 15,

        arcColorFn: d3.interpolateHsl(d3.rgb('#FFEE58'), d3.rgb('#e53935'))
    };

    this.pointer = undefined;
    this.scale = undefined;
    this.range = undefined;

    /**
     * Initializes the chart
     */
    this.init = function () {
        this.registerEvents();

        // Clear chart element
        this.element.innerHTML = "";

        this.setup();
    };


    /**
     * Register the object events
     */
    this.registerEvents = function () {

    };


    /**
     * Setup the chart with its basic components
     */
    this.setup = function () {
        let me = this;

        let r = undefined;
        let pointerHeadLength;

        let arc;
        let ticks;
        let tickData;

        me.range = me.config.maxAngle - me.config.minAngle;
        r = me.config.size / 2;
        pointerHeadLength = Math.round(r * me.config.pointerHeadLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        me.scale = d3.scaleLinear()
            .range([0, 1])
            .domain([me.config.minValue, me.config.maxValue]);

        ticks = me.scale.ticks(me.config.majorTicks);
        tickData = d3.range(me.config.majorTicks).map(() => {
            return 1 / me.config.majorTicks;
        });

        arc = d3.arc()
            .innerRadius(r - me.config.ringWidth - me.config.ringInset)
            .outerRadius(r - me.config.ringInset)
            .startAngle((d, i) => {
                let ratio = d * i;
                return me.deg2rad(me.config.minAngle + (ratio * me.range));
            })
            .endAngle((d, i) => {
                let ratio = d * (i + 1);
                return me.deg2rad(me.config.minAngle + (ratio * me.range));
            });


        function centerTranslation() {
            return 'translate(' + r + ',' + r + ')';
        }

        me.svg = d3.select(me.element);

        let centerTx = centerTranslation();

        let arcs = me.svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function (d, i) {
                return me.config.arcColorFn(d * i);
            })
            .attr('d', arc);

        let lg = me.svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', (d) => {
                let ratio = me.scale(d);
                let newAngle = me.config.minAngle + (ratio * me.range);
                return 'rotate(' + newAngle + ') translate(0,' + (me.config.labelInset - r) + ')';
            })
            .text(me.config.labelFormat);

        let lineData = [[me.config.pointerWidth / 2, 0],
            [0, -pointerHeadLength],
            [-(me.config.pointerWidth / 2), 0],
            [0, me.config.pointerTailLength],
            [me.config.pointerWidth / 2, 0]];
        let pointerLine = d3.line().curve(d3.curveLinear);
        let pg = me.svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx);

        me.pointer = pg.append('path')
            .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
            .attr('transform', 'rotate(' + me.config.minAngle + ')');

        // Initial value "0"
        me.push(0, 0);
    };


    /**
     * Changes the current value
     *
     * @param lineId the data-type-id
     * @param value
     */
    this.push = function (lineId, value) {
        let me = this;
        let ratio = me.scale(value);
        let angle = me.config.minAngle + (ratio * me.range);
        me.pointer.transition()
            .attr('transform', 'rotate(' + angle + ')');

    };


    /**
     * @param dataType data-type name
     */
    this.addDataType = function (dataType) {
        // Append a new data type to chartmap
        this.chartMap.push(dataType);

    };


    /**
     * @param dataType
     */
    this.removeDataType = function (dataType) {
        this.chartMap.splice(this.chartMap.indexOf(dataType), 1);
    };


    /**
     * Converts a deg value to rad
     *
     * @param deg
     * @returns {number}
     */
    this.deg2rad = function (deg) {
        return deg * Math.PI / 180;
    };


    /**
     * Returns the sampling time of the chart buffer
     * @return {number}
     */
    this.getSamplingTime = function () {
        return this.samplingTime;
    };


    /**
     * Sets the sampling time of the chart buffer
     * @param samplingTime
     */
    this.setSamplingTime = function (samplingTime) {
        this.samplingTime = samplingTime;
    };


    /**
     * This chart got no time period
     */
    this.hasPeriod = function () {
        return false;
    };

    // Init the chart
    this.init();
}

// Implement the chart interface
GaugeChart.prototype = Object.create(ChartInterface);
