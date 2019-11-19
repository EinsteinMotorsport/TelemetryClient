/**
 * Simple Linechart with D3.js
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */

import * as d3 from "d3";
import {dataTypes} from "../dataTypes.config";
import ChartInterface from "./ChartInterface";

export default class LineChart implements ChartInterface {

    constructor(element: Element) {
        this.element = element.parentElement;
        this.init();
    }


    // Svg Element in the document
    element: Element;

    // Contains the name of each data-type added to the chart
    chartMap: string[] = [];

    // Chart svg
    svg = null;
    canvas = null;
    legend = null;

    // Data displayed ordered by lineId
    data: number[][] = [];

    // Value which describes the upper bounding of the y-axis
    maxDisplayedValue = 0;

    // Contains the d3js line-generators
    lines: [] = [];

    // The time period shown on the x-axis in s
    period = 6;

    // The sampling time of the buffer in ms
    samplingTime = 10;

    // Axis container
    xAxis: d3.Axis<any> = null;
    yAxis: d3.Axis<any> = null;
    xScale = null;
    yScale = null;
    xAxisGroup = null;
    yAxisGroup = null;

    width = 700;
    height = 230;

    // Chart props
    margin = {
        top: 8,
        right: 200,
        bottom: 24,
        left: 24
    };

    /**
     * Returns the chart name in kebab-case
     * @return {string}
     */
    getName() {
        return 'line-chart';
    };

    /**
     * Initializes the chart
     */
    init() {
        this.registerEvents();

        // Clear chart element
        this.element.innerHTML = "";

        this.setup();
    };


    /**
     * Register the object events
     */
    registerEvents() {
        let me = this;

        window.addEventListener("resize", function (e: any) {
            me.onResizeWindow(e);
        });
    };


    /**
     * Setup the chart with its basic components
     */
    setup() {
        let me = this;

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
            .domain([-(me.getAmountOfValues() - 1), 0])
            .range([me.margin.left, me.width - (me.margin.right + me.margin.left)]);

        // Add axis
        me.xAxis = d3.axisBottom(me.xScale).tickFormat((d: number) => d / 1000 * this.getSamplingTime() + "s");
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
    push(dataType: string, value: number) {
        let me = this;

        console.log("line chart data", me.data);

        console.log("data type", dataType);

        // Push a new data point onto the back
        me.data[dataType].push(value);

        // If data set reaches the limit defined by "n"
        if (me.data[dataType].length >= me.getAmountOfValues()) {
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

        // Redraw the line
        me.svg.select(".line-" + dataType).attr("d", me.lines[dataType]).attr("transform", null);

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
    addDataType(dataType: string) {
        let me = this;

        // Init empty data-array matching the line
        me.data[dataType] = new Array(me.getAmountOfValues() - 1).fill(0);

        // Append a new data type to chartmap
        me.chartMap.push(dataType);

        // Add line to array
        me.lines[dataType] = d3.line()
            .x((d, i) => {
                return me.xScale(i - me.getAmountOfValues() + 1);
            })
            .y(function (d: any) {
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
     * @param dataType
     */
    removeDataType(dataType: string) {
        let me = this;

        // Remove line from array
        delete me.lines[dataType];

        // Remove data-type from chartmap
        me.chartMap.splice(me.chartMap.indexOf(dataType), 1);

        // Remove values from data-array
        delete me.data[dataType];

        // Remove the line from the drawn chart
        me.svg.select('.line-' + dataType).remove();

        // Force rescaling the charts axis on next tick
        me.maxDisplayedValue = me.getMaxValueFromData();

        // Redraw legend
        me.printLegend();
    };


    /**
     * Loop through data array an return the max value of it
     *
     * @returns the max value currently displayed in the chart
     */
    getMaxValueFromData() {
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
    rescaleAxis() {
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
    onResizeWindow(e) {
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
    printLegend() {
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


    /**
     * Returns the sampling time of the chart buffer
     * @return {number}
     */
    getSamplingTime() {
        return this.samplingTime;
    };


    /**
     * Sets the sampling time of the chart buffer
     * @param samplingTime
     */
    setSamplingTime(samplingTime: number) {
        this.samplingTime = samplingTime;
    };


    /**
     * Returns the amount of values shown by one line with the given
     * period and sampling time
     */
    getAmountOfValues() {
        return this.period / this.getSamplingTime() * 1000
    };


    /**
     * Update period of the chart -> change scale of x-axis
     * @param newPeriod
     */
    changePeriod(newPeriod: number) {
        let me = this;

        // Set period property
        me.period = newPeriod;

        // Adjust data arrays
        Object.keys(me.data).forEach((dataType) => {

            if (me.getAmountOfValues() < me.data[dataType].length) {
                me.data[dataType].length = me.getAmountOfValues();
            }

            // Add line to array
            me.lines[dataType].x(function (d, i) {
                return me.xScale(i - me.getAmountOfValues() + 1);
            });
        });

        // Redefine x-scale
        me.xScale = d3.scaleLinear()
            .domain([-(me.getAmountOfValues() - 1), 0])
            .range([me.margin.left, me.width - (me.margin.right + me.margin.left)]);

        // Add axis
        me.xAxis = d3.axisBottom(me.xScale).tickFormat((d: number) => d / 1000 * this.getSamplingTime() + "s");

        // Update axis
        me.xAxisGroup.call(me.xAxis);
    };


    /**
     * This chart got a time period
     */
    hasPeriod() {
        return true;
    };
}
