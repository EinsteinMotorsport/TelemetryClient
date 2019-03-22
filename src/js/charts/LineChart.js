// Simple Linechart with D3.js
function LineChart(element) {
    // Svg Element in the document
    this.element = element;

    // Mapping the datatypes to the chart
    this.chartMap = [];

    // Chart properties
    this.svg = null;
    this.data = null;
    this.line = null;
    this.x = null;

    this.init = function () {
        this.registerEvents();

        this.build();
    };

    this.registerEvents = function () {

    };

    // Builds the chart
    this.build = function () {

        var me = this;
        me.n = 30;
        me.random = d3.randomNormal(0, 20);
        me.data = d3.range(me.n).map(me.random);

        me.svg = d3.select(me.element);
        var margin = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 40
            };
        var width = document.getElementsByClassName('media')[0].clientWidth;
        var height = +me.svg.attr("height") - margin.top - margin.bottom;
        var g = me.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        me.x = d3.scaleLinear()
            .domain([0, me.n - 1])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, 70])
            .range([height, 0]);
        me.line = d3.line()
            .x(function (d, i) {
                return me.x(i);
            })
            .y(function (d, i) {
                return y(d);
            });
        g.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(me.x));
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(6));
        g.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(me.data)
            .attr("class", "line")
            .transition()
            .duration(500)
            .ease(d3.easeLinear);
    };

    this.push = function (value) {
        var me = this;

        // Push a new data point onto the back.
        me.data.push(value);

        // Redraw the line.
        me.svg.select(".line").attr("d", me.line).attr("transform", null);

        // Slide it to the left.
        me.svg.select(".line").attr("transform", "translate(" + me.x(-1) + ",0)").transition();

        // Pop the old data point off the front.
        me.data.shift();
    };

    this.init();
}
