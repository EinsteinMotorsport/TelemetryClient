/**
 * GaugeChart with D3.js
 *
 * http://bl.ocks.org/msqr/3202712
 *
 * @implements ChartInterface
 * @param element
 * @constructor
 */
import * as d3 from "d3";
import ChartInterface from "./ChartInterface";

export default class GaugeChart implements ChartInterface {

    constructor(element: Element) {
        this.element = element;
        this.init();
    }

    // Svg Element in the document
    element: Element;

    // Mapping the data-types to the chart
    chartMap: [] = [];

    // Chart svg
    svg: any = null;

    // The sampling time of the buffer in ms
    samplingTime = 10;

    // Chart configuration
    config = {
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

    pointer: any = undefined;
    scale = undefined;
    range: number = undefined;

    /**
     * Returns the chart name in kebab-case
     * @return {string}
     */
    getName() {
        return 'gauge-chart';
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

    };


    /**
     * Setup the chart with its basic components
     */
    setup() {
        let me = this;

        let r: number = undefined;
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
            .startAngle((d: any, i) => {
                let ratio = d * i;
                return me.deg2rad(me.config.minAngle + (ratio * me.range));
            })
            .endAngle((d: any, i) => {
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
            .attr('fill', function (d: number, i: number) {
                return me.config.arcColorFn(d * i);
            })
            .attr('d', arc);

        let lg = me.svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', (d: number) => {
                const ratio = me.scale(d);
                const newAngle = me.config.minAngle + (ratio * me.range);
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
        me.push("id", 0);
    };


    /**
     * Changes the current value
     *
     * @param dataType the data-type-id
     * @param value
     */
    push(dataType: string, value: number) {
        const ratio = this.scale(value);
        const angle = this.config.minAngle + (ratio * this.range);
        this.pointer.transition()
            .attr('transform', 'rotate(' + angle + ')');
    };


    /**
     * @param dataType data-type name
     */
    addDataType(dataType: string) {
        // Append a new data type to chartmap
        // @ts-ignore
        this.chartMap.push(dataType);

    };


    /**
     * @param dataType
     */
    removeDataType(dataType: string) {
        // @ts-ignore
        this.chartMap.splice(this.chartMap.indexOf(dataType), 1);
    };


    /**
     * Converts a deg value to rad
     *
     * @param deg
     * @returns {number}
     */
    deg2rad(deg: number) {
        return deg * Math.PI / 180;
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
     * This chart got no time period
     */
    hasPeriod() {
        return false;
    };
}
