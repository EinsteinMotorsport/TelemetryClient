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

    // Contains the name of each data-type added to the chart
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

    this.width = 700;
    this.height = 230;

    // Chart props
    this.margin = {
        top: 8,
        right: 200,
        bottom: 24,
        left: 24
    };

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

        // Displayed seconds
        me.n = 600;

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
            .domain([-(me.n - 1), 0])
            .range([me.margin.left, me.width - (me.margin.right + me.margin.left)]);

        // Add axis
        me.xAxis = d3.axisBottom(me.xScale).tickFormat(d => d/100 + "s");
        me.yAxis = d3.axisLeft(me.yScale);

        // Add x-axis as a g element
        me.xAxisGroup = me.svg.append("g")
            .attr("transform", "translate(" + [0, me.height - me.margin.bottom] + ")")
            .call(me.xAxis);

        // Add y-axis as a g element
        me.yAxisGroup = me.svg.append("g")
            .attr("transform", "translate(" + [me.margin.left, 0] + ")")
            .call(me.yAxis);

        // Print chart legend
        me.printLegend();
    };


    /**
     * Adds a value to one line of the chart
     *
     * @param dataType the data-type-id
     * @param value
     */
    this.push = function (dataType, value) {
        let me = this;

        // Push a new data point onto the back
        me.data[dataType].push(value);

        // Redraw the line
        me.svg.select(".line-" + dataType).attr("d", me.lines[dataType]).attr("transform", null);

        // If data set reaches the limit defined by "n"
        if (me.data[dataType].length >= me.n) {
            // The value which will be dropped
            let droppedValue = me.data[dataType][0];

            // Pop the old data point off the front.
            me.data[dataType].shift();

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
     * @param dataType number Should match data-type id
     */
    this.addDataType = function (dataType) {
        let me = this;

        // Init empty data-array matching the line
        me.data[dataType] = new Array(me.n-1).fill(0);

        // Add line to array
        me.lines[dataType] = d3.line()
            .x(function (d, i) {
                return me.xScale(i-me.n+1);
            })
            .y(function (d) {
                return me.yScale(d);
            });

        // Append line to the svg element
        me.svg.append("g")
            .append("path")
            .datum(me.data[dataType])
            .attr("class", "line line-" + dataType)
            .attr("stroke", dataTypes[dataType]['color'])
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .transition()
            .duration(500)
            .ease(d3.easeLinear);

        // Redraw legend
        me.printLegend();
    };

    /**
     * Removes a line from the line chart
     *
     * @param key
     */
    this.removeDataType = function (key) {
        let me = this;

        console.log("key", key);

        // Remove line from array
        me.lines.splice(key, 1);

        // Remove the line from the drawn chart
        me.svg.selectAll('.line').filter((d, i) => i === key).remove();

        // Redraw legend
        me.printLegend();
    };



    /**
     * Loop through data array an return the max value of it
     *
     * @returns the max value currently displayed in the chart
     */
    this.getMaxValueFromData = function () {
        let maxValue = 0;
        let me = this;

        Object.keys(me.data).forEach((key) => {
            let arr = me.data[key];
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
        //me.yScale.domain([this.maxDisplayedValue, 0]).range([me.margin.left, me.width - me.margin.right]);
        //me.yAxis.scale(me.yScale);

        // Update the y-axis
        //me.yAxisGroup.call(me.yAxis);
    };


    /**
     *
     * helpful guide: https://www.d3-graph-gallery.com/graph/custom_legend.html
     */
    this.printLegend = function () {
        let me = this;
        let offset = 0;

        // Delete prev legend
        me.svg.select(".chart-line-legend").remove();

        // Create new legend
        me.legend = me.svg.append("g").attr("class", "chart-line-legend");
        me.chartMap.forEach((value) => {
            me.legend.append("circle").attr("cx", 500).attr("cy", 50 + offset).attr("r", 6).style("fill", dataTypes[value]["color"]);
            me.legend.append("text").attr("x", 520).attr("y", 50 + offset).text(dataTypes[value]['translation'])
                .style("font-size", "15px").attr("alignment-baseline", "middle");
            offset += 20;
        });
    };


    // Init the chart
    this.init();
}

// Implement the chart interface
LineChart.prototype = Object.create(ChartInterface);
