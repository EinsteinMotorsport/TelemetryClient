/**
 * Simple Linechart with D3.js
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */
function LineChart(element) {
    // Svg Element in the document
    this.element = element.parentNode;

    // Mapping the data-types to the chart
    this.chartMap = [];

    // Chart svg
    this.svg = null;

    // Data displayed ordered by lineId
    this.data = [];

    // Value which describes the upper bounding of the y-axis
    this.maxDisplayedValue = 0;

    // Contains the d3js line-generators
    this.lines = [];

    // Axis container
    this.xAxis = null;
    this.yAxis = null;
    this.xScale = null;
    this.yScale = null;
    this.xAxisGroup = null;
    this.yAxisGroup = null;

    this.width = 500;
    this.height = 200;

    // Chart props
    this.margin = {
        top: 8,
        right: 24,
        bottom: 24,
        left: 24
    };

    // Possible colors for graph lines
    this.colors = [
        '#1A237E',
        '#827717',
        '#D81B60',
        '#3E2723',
        '#004D40',
        '#FF6F00',
        '#43A047',
    ];


    /**
     * Initializes the chart
     */
    this.init = function () {
        this.registerEvents();

        // Clear chart element
        console.log(this.element);
        this.element.innerHTML = "";

        // Shuffle the colors used by the lines
        this.colors.shuffle();

        this.setup();
    };


    /**
     * Register the object events
     */
    this.registerEvents = function () {
        let me = this;

        window.on("resize", function (e) {
            me.onResizeWindow();
        });
    };


    /**
     * Setup the chart with its basic components
     */
    this.setup = function () {
        let me = this;

        // Amount of displayed values
        me.n = 30;

        // Create the svg
        me.svg = d3.select(me.element).append('svg:svg')
            .attr('width', me.width)
            .attr('height', me.height)
            .attr('class', 'svg-plot')
            .append('g')
            .attr('transform', `translate(${me.margin.left}, ${me.margin.top})`);

        // Create the canvas
        me.canvas = d3.select(me.element).append('canvas')
            .attr('width', me.width)
            .attr('height', me.height)
            .style('margin-left', me.margin.left + 'px')
            .style('margin-top', me.margin.top + 'px')
            .attr('class', 'canvas-plot');

        // Define y-scale
        me.yScale = d3.scaleLinear()
            .domain([1, 0])
            .range([me.margin.top, me.height - me.margin.bottom]);

        // Define x-scale
        me.xScale = d3.scaleLinear()
            .domain([0, me.n - 1])
            .range([me.margin.left, me.width - me.margin.right]);

        // Add axis
        me.xAxis = d3.axisBottom(me.xScale);
        me.yAxis = d3.axisLeft(me.yScale);

        // Add x-axis as a g element
        me.xAxisGroup = me.svg.append("g")
            .attr("transform", "translate(" + [0, me.height - me.margin.bottom] + ")")
            .call(me.xAxis);

        // Add y-axis as a g element
        me.yAxisGroup = me.svg.append("g")
            .attr("transform", "translate(" + [me.margin.left, 0] + ")")
            .call(me.yAxis);
    };

    /**
     * Adds a value to one line of the chart
     *
     * @param lineId the data-type-id
     * @param value
     */
    this.push = function (lineId, value) {
        let me = this;

        console.log("LineChart:push data-array", me.data);

        // Push a new data point onto the back
        me.data[lineId].push(value);

        // Redraw the line
        me.svg.select(".line-" + lineId).attr("d", me.lines[lineId]).attr("transform", null);

        // If data set reaches the limit defined by "n"
        if (me.data[lineId].length >= me.n) {
            // Slide it to the left.
            me.svg.select(".line-" + lineId).attr("transform", "translate(" + me.xScale(-1) + ",0)").transition();

            // The value which will be dropped
            let droppedValue = me.data[lineId][0];

            // Pop the old data point off the front.
            me.data[lineId].shift();

            // Rescale if max value dropped out
            if (droppedValue >= me.maxDisplayedValue) {
                // Get new max value
                me.maxDisplayedValue = me.getMaxValueFromData();
                // Rescale
                me.rescaleAxis()
            }
        }

        // Update scale if new value is bigger than the last max value of the chart
        if (value > me.maxDisplayedValue) {
            me.maxDisplayedValue = value;
            // Rescale the axis
            me.rescaleAxis();
        }
    };


    /**
     * Adds a line to the line chart.
     * Each data-type is represented by a line in this graph.
     *
     * @param lineId number Should match data-type id
     */
    this.addDataType = function (lineId) {
        let me = this;

        // Init empty data-array matching the line
        me.data[lineId] = [];

        // Add line to array
        me.lines[lineId] = d3.line()
            .x(function (d, i) {
                return me.xScale(i);
            })
            .y(function (d, i) {
                return me.yScale(d);
            });

        // Append line to the svg element
        me.svg.append("g")
            .append("path")
            .datum(me.data[lineId])
            .attr("class", "line line-" + lineId)
            .attr("stroke", `${me.colors[lineId % me.colors.length]}`)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .transition()
            .duration(500)
            .ease(d3.easeLinear);
    };


    /**
     * Removes a line from the line chart
     *
     * @param lineId
     */
    this.removeDataType = function (lineId) {
        let me = this;

        // Remove line from array
        me.lines.slice(lineId, 1);
    };


    /**
     * Loop through data array an return the max value of it
     *
     * @returns the max value currently displayed in the chart
     */
    this.getMaxValueFromData = function () {
        let maxValue = 0;
        this.data.forEach((arr) => {
            let max = Math.max(...arr);
            if (max > maxValue) {
                maxValue = max;
            }
        });
        return maxValue;
    };


    /**
     * Rescales the axis using the maxDisplayValue for max y-axis value
     */
    this.rescaleAxis = function () {
        let me = this;

        // Update the y-scale
        me.yScale.domain([me.maxDisplayedValue, 0]).range([me.margin.top, me.height - me.margin.bottom]);
        me.yAxis.scale(me.yScale);

        // Update the y-axis
        me.yAxisGroup.call(me.yAxis);
    };



    /**
     * Handle the resize of the window and rescale the x-axis
     *
     * @param e
     */
    this.onResizeWindow = function (e) {
        let me = this;

        // TODO: Make magic happen


        console.log("resize");

        // Update the y-scale
        me.xScale.domain([this.maxDisplayedValue, 0]).range([me.margin.left, me.width - me.margin.right]);
        me.xAxis.scale(me.xScale);

        // Update the y-axis
        me.xAxisGroup.call(me.xAxis);
    };

    // Init the chart
    this.init();
}

// Implement the chart interface
LineChart.prototype = Object.create(ChartInterface);
