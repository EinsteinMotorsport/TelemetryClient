import DataHandler from "./DataHandler";
import Draggable from "./Draggable";
import ChartConfiguration from "./overlays/ChartConfiguration";
import RefreshRateTracker from "./RefreshRateTracker";
import ChartBuffer from "./ChartBuffer";
import NumberChart from "./charts/NumberChart";
import GaugeChart from "./charts/GaugeChart";
import LineChart from "./charts/LineChart";
import PresetOption from "./PresetOption";

export default class App {

    /**
     * Singleton instance
     */
    private static instance: App = null;

    private constructor() {
    };

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }

    // Property for an Websocket Instance
    static websocket: WebSocket = undefined;

    // Handles the data-flow to the chart
    static chartDataHandler = new DataHandler();

    static draggable = new Draggable();

    static chartConfiguration = new ChartConfiguration();

    /**
     * Initialize Application
     */
    init() {
        // register its elements
        this.registerEvents();

        // Starts draggable
        App.draggable.init();

        // Init ChartConfiguration overlay
        App.chartConfiguration.init();

        // Apply preset TODO: different presets for each discipline
        this.applyPreset();
    };

    /**
     * Registers all events depending on this class
     */
    registerEvents() {
        let me = this;

        // Event-listener for elements starting a WebSocket connection
        document.getElementsByClassName('start-socket').on('click', me.onClickStartSocket);

        // Event-listener for elements stopping a WebSocket connection
        document.getElementsByClassName('stop-socket').on('click', me.onClickStopSocket);

        // Listen for changes on text inputs to design the label correctly
        document.querySelectorAll('input[type="text"]').on('keyup', (e: any) => {
            me.onKeyupInputText(e);
        });
    };


    /**
     * Event-listener for elements starting a WebSocket connection
     */
    onClickStartSocket() {
        // Tracks the time between two values arriving
        const refreshRateTracker = new RefreshRateTracker();

        // New connection to local running WebSocket Server
        App.websocket = new WebSocket("ws://127.0.0.1:7777/service");
        //App.websocket = new WebSocket("ws://141.59.140.154:7777/service");

        // When connection is established
        App.websocket.onopen = function () {
            // Send test-data to the Server
            App.websocket.send("Hello server");
        };

        // Event for handling data sent from the server
        App.websocket.onmessage = function (evt) {
            // Notify refresh time tracker
            refreshRateTracker.notify();

            // Parse Data and give it to the charts
            App.chartDataHandler.push(evt.data);
        };

        // Event fired when WebSocket connection is closed
        App.websocket.onclose = function () {
            // websocket is closed.
        };
    };

    /**
     * Event-listener for elements stopping a WebSocket connection
     */
    onClickStopSocket() {
        if (App.websocket != null) {
            App.websocket.close();
        }
    };


    /**
     * Returns true if there is an active connection via websocket
     */
    isWebsocketOpen() {
        return App.websocket && App.websocket.readyState === 1;
    };


    /**
     * Listen for changes on text inputs to design the label correctly
     *
     * @param e
     */
    onKeyupInputText(e: any) {
        if (e.target.value === "") {
            e.target.classList.remove("has-content");
        } else {
            e.target.classList.add("has-content");
        }
    };


    /**
     * Apply a hardcoded preset
     * Set charts with values by default on launching the app
     * At the moment the amount of charts must match the amount of cards in the index.html.
     * Later this should be flexible and cards will be added in a loop through the preset.
     */
    applyPreset() {
        let preset: PresetOption[] = [
            {
                "type": "line-chart",
                "values": ["tmot", "tmot2"]
            }, {
                "type": "line-chart",
                "values": ["p_brake_f", "p_brake_r"]
            }, {
                "type": "line-chart",
                "values": ["pfuel", "poil"]
            }, {
                "type": "number-chart",
                "values": []
            }, {
                "type": "gauge-chart",
                "values": []
            }
        ];

        // Select each chart element and loop through all of them
        document.querySelectorAll("[data-chart-id]").forEach((value, key) => {

            // Add new buffer as container for a chart of type ChartInterface
            App.chartDataHandler.chartBuffers[key] = new ChartBuffer();

            // Get the chart type from the data-attribute and decide which chart object is needed
            switch (preset[key].type) {
                case "number-chart":
                    App.chartDataHandler.chartBuffers[key].setChart(new NumberChart(value.querySelector('.media > svg')));
                    break;
                case "gauge-chart":
                    App.chartDataHandler.chartBuffers[key].setChart(new GaugeChart(value.querySelector('.media > svg')));
                    break;
                case "line-chart":
                default:
                    App.chartDataHandler.chartBuffers[key].setChart(new LineChart(value.querySelector('.media > svg')));
            }

            // Add the watched data-types to the chart
            preset[key].values.forEach((dataType: string) => {
                // Add the data-type
                App.chartDataHandler.chartBuffers[key].chart.addDataType(dataType);
            });
        });
    }
};

/**
 * Event handler for an Array of classes
 */
NodeList.prototype.on = function (event, callback) {
    // Add EventListener for each element
    Array.from(this).forEach((element: Element) => {
        element.addEventListener(event, e => {
            callback(e)
        });
    });
};
HTMLCollection.prototype.on = function (event, callback) {
    // Add EventListener for each element
    Array.from(this).forEach((element: Element) => {
        element.addEventListener(event, e => {
            callback(e)
        });
    });
};
Element.prototype.on = function (event, callback) {
    this.addEventListener(event, e => {
        callback(e);
    })
};

/**
 * Uppercase the first char of a string
 *
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 *
 * https://stackoverflow.com/a/12646864
 */
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};


/**
 * Converts kebabcase-written style with camelcase style
 * https://stackoverflow.com/a/6661012
 *
 * @returns {string}
 */
String.prototype.kebabToCamelCase = function () {
    return this.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    }).capitalize();
};

/**
 * Checks if parameter is number
 * https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
 * @param n
 * @return {boolean}
 */
Number.prototype.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};


/**
 * Returns the real size of an array. Length returns only the biggest index.
 * @return int
 */
Array.prototype.size = function () {
    let counter = 0;
    this.forEach(() => {
        counter++;
    });
    return counter;
};
