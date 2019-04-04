/**
 * Simple Linechart with D3.js
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */
function LineChart(element) {
    // Svg Element in the document
    this.element = element;

    // Mapping the datatypes to the chart
    this.chartMap = [];

    // Chart svg
    this.svg = null;

    // Data displayed ordered by lineId
    this.data = [];

    // Contains the d3js line-generators
    this.lines = [];

    // Axis container
    this.xAxis = null;
    this.yAxis = null;

    // Graph element
    this.g = null;

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
        this.element.innerHTML = "";

        // Shuffle the colors used by the lines
        this.colors.shuffle();

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

        // Amount of displayed values
        me.n = 30;

        // Select the svg
        me.svg = d3.select(me.element);

        // Chart props
        let margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 40
        };
        let width = document.getElementsByClassName('media')[0].clientWidth;
        let height = +me.svg.attr("height") - margin.top - margin.bottom;

        // Add basic elements to svg
        me.g = me.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        me.g.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);


        // Define y-axis
        me.yAxis = d3.scaleLinear()
            .domain([0, 70])
            .range([height, 0]);
        me.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(me.yAxis).ticks(6));


        // Define x-axis
        me.xAxis = d3.scaleLinear()
            .domain([0, me.n - 1])
            .range([0, width]);
        me.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + me.yAxis(0) + ")")
            .call(d3.axisBottom(me.xAxis));
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
            me.svg.select(".line-" + lineId).attr("transform", "translate(" + me.xAxis(-1) + ",0)").transition();

            // Pop the old data point off the front.
            me.data[lineId].shift();
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
                return me.xAxis(i);
            })
            .y(function (d, i) {
                return me.yAxis(d);
            });

        // Append line to the svg element
        me.g.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(me.data[lineId])
            .attr("class", "line line-" + lineId)
            .attr("stroke", `${this.colors[lineId % this.colors.length]}`)
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


    // Init the chart
    this.init();
}

// Implement the chart interface
LineChart.prototype = Object.create(ChartInterface);
