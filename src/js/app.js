(function () {
    app = {

        // Property for an Websocket Instance
        websocket: null,

        // Handles the data-flow to the chart
        chartDataHandler: new DataHandler(),

        init: function () {
            this.registerEvents();

            this.chartDataHandler.chartMap.speed = new LineChart('svg#ws-chart');
        },

        registerEvents: function () {
            var me = this;

            document.getElementsByClassName('start-socket').on('click', me.onClickStartSocket);

            document.getElementsByClassName('stop-socket').on('click', me.onClickStopSocket);
        },

        onClickStartSocket: function (e) {
            var me = this;

            me.websocket = new WebSocket("ws://localhost:7777/service");

            me.websocket.onopen = function () {
                me.websocket.send("Hello server");
            };

            me.websocket.onmessage = function (evt) {
                // Parse Data and give it to the charts
                app.chartDataHandler.push(evt.data);
            };
            me.websocket.onclose = function () {
                // websocket is closed.
            };
        },

        onClickStopSocket: function () {
            if (this.websocket != null) {
                this.websocket.close();
            }
        },
    };

    document.addEventListener("DOMContentLoaded", function () {
        app.init();
    });
})();

Object.prototype.on = function (event, callback) {
    var me = this;
    Array.from(me).forEach(function (element) {
        element.addEventListener(event, callback);
    });
};