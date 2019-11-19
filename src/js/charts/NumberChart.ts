/**
 * Chart which only gives the value as a number
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */
import ChartInterface from "./ChartInterface";
import * as d3 from "d3";

export default class NumberChart implements ChartInterface {

    constructor(element: Element) {
        this.element = element;
        this.init();
    }


    // Svg Element in the document
    element: Element;

    // Mapping the data-types to the chart
    chartMap: string[] = [];

    // The sampling time of the buffer in ms
    samplingTime: number = 10;

    // Chart svg
    svg = null;

    // Container element which displays the value
    valueContainer = null;

    // Amount auf display values
    n: number = null;

    // D3 svg draw g
    g = null;

    /**
     * Returns the chart name in kebab-case
     * @return {string}
     */
    getName(): string {
        return 'number-chart';
    };

    /**
     * Initializes the chart
     */
    init(): void {
        this.registerEvents();

        // Clear chart element
        this.element.innerHTML = "";

        this.setup();
    };


    /**
     * Register the object events
     */
    registerEvents(): void {

    };


    /**
     * Setup the chart with its basic components
     */
    setup(): void {
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

        // Append the container element to display the value
        me.valueContainer = me.g.append("text")
            .attr("class", "chart-number")
            .attr("fill", "black")
            .attr("y", 50)
            .attr("font-size", "50px");

        // Display initial value
        me.valueContainer.text("0");
    };


    /**
     * Adds a value to the chart
     *
     * @param dataType the data-type-id
     * @param value
     */
    push(dataType: string, value: number) {
        let me = this;

        // Update the shown value
        me.valueContainer.text(value);
    };


    /**
     * @param dataType
     */
    addDataType(dataType: string) {
        // Append a new data type to chartmap
        this.chartMap.push(dataType);

    };


    /**
     * @param dataType
     */
    removeDataType(dataType) {
        this.chartMap.splice(this.chartMap.indexOf(dataType), 1);
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
    setSamplingTime(samplingTime) {
        this.samplingTime = samplingTime;
    };


    /**
     * This chart got no time period
     */
    hasPeriod() {
        return false;
    };
}
