var chartConfiguration = {

    chartId: null,

    changingCard: null,

    init: function () {
        let me = this;

        me.registerEvents();
    },

    registerEvents: function () {
        let me = this;

        // On click open overlay
        document.querySelectorAll("[data-overlay-open='chart-configuration']").on('click', function (e) {
            me.onClickOpenOverlay(e)
        });

        // On click close overlay
        document.querySelectorAll("[data-overlay-close='chart-configuration']").on('click', function (e) {
            me.onClickCloseOverlay(e)
        });
        // On click close overlay
        document.getElementsByClassName("overlay--container").on('click', function (e) {
            me.onClickOverlayContainer(e)
        });

        // On click the save button
        document.getElementsByClassName("chart-configuration-save").on('click', function (e) {
            me.onClickChartConfigurationSave(e);
        });

        // On click add chart value to chart
        document.getElementById("chart-value-add").on('click', function (e) {
            me.onClickChartValueAdd(e);
        });

        // On click remove chart value from chart
        document.getElementsByClassName("list--data-types").on('click', function (e) {
            if (e.target.classList.contains('data-type--delete')) {
                me.onClickChartValueRemove(e);
            }
        });
    },

    onClickChartValueAdd: function (e) {
        e.preventDefault();
        let me = this;

        // Select dropdown for data-types
        let dataTypeSelect = document.getElementById("chart-configuration-data-type");

        // Append a new data type to chartmap
        app.chartDataHandler.charts[me.chartId].chartMap.push(dataTypeSelect.value);

        // Add the datatype to the list (id, label) e.g. (speed, Geschwindigkeit)
        this.addDataTypeToList(
            dataTypeSelect.options[dataTypeSelect.selectedIndex].value,
            dataTypeSelect.options[dataTypeSelect.selectedIndex].innerHTML
        );
    },

    onClickChartValueRemove: function (e) {
        let me = this;
        // Data-type Id of the clicked element
        let dataTypeId = e.target.dataset.id;

        // Delete the element from the datahandler
        for (let i = 0; i < app.chartDataHandler.charts[me.chartId].chartMap.length; i++) {
            if (app.chartDataHandler.charts[me.chartId].chartMap[i] === dataTypeId) {
                app.chartDataHandler.charts[me.chartId].chartMap.splice(i, 1);
            }
        }

        // Remove the element from the DOM
        this.removeDataTypeFromList(dataTypeId);
    },

    onClickOpenOverlay: function (e) {
        let me = this;

        // Save the card which is currently edited to the object
        me.changingCard = e.target.closest('.card');

        // Get the id of the chart
        me.chartId = me.changingCard.dataset.chartId;

        // Load the configuration out of the chart map in the data handler
        this.load();

        // Show the overlay
        document.querySelector("[data-overlay='configure']").classList.add("overlay--visible");
    },

    onClickCloseOverlay: function (e) {
        // Hide the overlay
        document.querySelector("[data-overlay='configure']").classList.remove("overlay--visible");

        // clear the node list of data types
        this.clearList();
    },

    onClickOverlayContainer: function (e) {
        // check if clicked element is outside the overlay -> close on click in the darkened area
        if (e.srcElement.classList.contains("overlay--container"))
            this.onClickCloseOverlay(e);
    },

    onClickChartConfigurationSave: function (e) {
        e.preventDefault();
        let me = this;

        // Charttypes select
        let chartTypeSelect = document.getElementById("chart-configuration-chart-type");

        // Set charttype
        switch (chartTypeSelect.value) {
            case "linechart":
            default:
                // Set Chart to linechart
                app.chartDataHandler.charts[me.chartId] = new LineChart(me.changingCard.querySelector('.media > svg'));
        }

        // Hide the overlay
        me.onClickCloseOverlay();
    },

    // Add a data type to the list in the overlay
    addDataTypeToList: function (id, label) {
        document.getElementsByClassName('list--data-types')[0].innerHTML +=
            `<li>${label}<i data-id="${id}" class="material-icons data-type--delete">close</i></li>`;
    },

    // Removes a data type from the list in the overlay
    removeDataTypeFromList: function (id) {
        document.querySelector(`[data-id="${id}"]`).parentNode.remove();
    },

    // Removes all elements in the list in the overlay (clearing on close)
    clearList: function () {
        document.querySelector('.list--data-types').innerHTML = '';
    },

    // Load chart configuration out of the datahandler
    load: function () {
        console.log("All charts", app.chartDataHandler.charts);
        console.log("Chart config", app.chartDataHandler.charts[this.chartId]);

        // If chart config exists
        if (app.chartDataHandler.charts[this.chartId]) {

            // ChartMap contains all data types displayed in the chart
            let chartMap = app.chartDataHandler.charts[this.chartId].chartMap || [];

            // If data types are set, loop through them and display them in the list of added data types
            if (chartMap.length !== 0) {
                for (let i = 0; i < chartMap.length; i++) {
                    // TODO: Translation
                    this.addDataTypeToList(chartMap[i], chartMap[i].capitalize())
                }
            }

            // TODO: Chart type

        }
    }
};