var app = {

    // Property for an Websocket Instance
    websocket: null,

    // Handles the data-flow to the chart
    chartDataHandler: new DataHandler(),

    // Initialize Application
    init: function () {
        // register its elements
        this.registerEvents();

        // Starts draggable
        draggable.init();

        // Init ChartConfiguration overlay
        chartConfiguration.init();
    },

    // Registers all events depending on this class
    registerEvents: function () {
        let me = this;

        // Event-listener for elements starting a WebSocket connection
        document.getElementsByClassName('start-socket').on('click', me.onClickStartSocket);

        // Event-listener for elements stopping a WebSocket connection
        document.getElementsByClassName('stop-socket').on('click', me.onClickStopSocket);
    },

    // Event-listener for elements starting a WebSocket connection
    onClickStartSocket: function (e) {
        let me = this;

        // New connection to local running WebSocket Server
        me.websocket = new WebSocket("ws://localhost:7777/service");

        // When connection is established
        me.websocket.onopen = function () {
            // Send test-data to the Server
            me.websocket.send("Hello server");
        };

        // Event for handling data sent from the server
        me.websocket.onmessage = function (evt) {
            // Parse Data and give it to the charts
            app.chartDataHandler.push(evt.data);
        };

        // Event fired when WebSocket connection is closed
        me.websocket.onclose = function () {
            // websocket is closed.
        };
    },

    // Event-listener for elements stopping a WebSocket connection
    onClickStopSocket: function () {
        if (this.websocket != null) {
            this.websocket.close();
        }
    },
};

// Start application when document is completely loaded
document.addEventListener("DOMContentLoaded", function () {
    app.init();
});


// Event handler for an Array of classes
Object.prototype.on = function (event, callback) {
    let me = this;
    Array.from(me).forEach(function (element) {
        element.addEventListener(event, function (e) {
            callback(e)
        });
    });
};



// DATA_TYPE CONSTANTS
const DATE_TYPE_SPEED = "speed";
const DATE_TYPE_ACCELERATION = "acceleration";
const DATE_TYPE_OIL_PRESSURE = "oil-pressure";
const DATE_TYPE_SHIFT = "shift";
