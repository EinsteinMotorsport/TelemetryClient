let chartConfiguration = {

    chartId: null,

    changingCard: null,


    /**
     * Init the object
     */
    init: function () {
        // Register the eventhandler
        this.registerEvents();

        // Load the data-types into the form
        this.loadDataTypes();
    },


    /**
     * Register the objects events
     */
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
        document.getElementById("chart-configuration-chart-type").on('change', function (e) {
            me.onChangeChartType(e);
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

        // On change timer interval of chart buffer
        document.getElementById("chart-configuration-interval").on('change', function (e) {
            me.onChangeChartBufferInterval(e);
        });
    },


    /**
     * Adds the in the dropdown selected data type to the chart datahandler and the list
     *
     * @param e event
     */
    onClickChartValueAdd: function (e) {
        e.preventDefault();
        let me = this;

        // Select dropdown for data-types
        let dataTypeSelect = document.getElementById("chart-configuration-data-type");

        // Changing chart
        let chart = app.chartDataHandler.chartBuffers[me.chartId].chart;

        // Append a new data type to chartmap
        chart.chartMap.push(dataTypeSelect.value);

        // Selected element from the data-type dropdown
        let selectedElement = dataTypeSelect.options[dataTypeSelect.selectedIndex];

        // Add the datatype to the list (id, label) e.g. (speed, Geschwindigkeit)
        this.addDataTypeToList(selectedElement.value, selectedElement.innerHTML);

        // Add the data-type to the chart
        chart.addDataType(selectedElement.value);
    },


    /**
     * Removes a value from the list of displayed data type if the delete icon was clicked
     *
     * @param e event
     */
    onClickChartValueRemove: function (e) {
        let me = this;
        // Data-type Id of the clicked element
        let dataTypeId = e.target.dataset.id;

        // Changing chart
        let chart = app.chartDataHandler.chartBuffers[me.chartId].chart;

        // Delete the element from the datahandler
        for (let i = 0; i < chart.chartMap.length; i++) {
            if (chart.chartMap[i] === dataTypeId) {
                chart.chartMap.splice(i, 1);

                // Remove data-type from chart
                chart.removeDataType(i);
            }
        }

        // Remove the list-element from the DOM
        this.removeDataTypeFromList(dataTypeId);
    },


    /**
     * Open the overlay and trigger the load method the display the configuration of the chart
     *
     * @param e event
     */
    onClickOpenOverlay: function (e) {
        let me = this;

        // Save the card which is currently edited to the object
        me.changingCard = e.target.closest('.card');

        // Get the id and type of the chart
        me.chartId = me.changingCard.dataset.chartId;
        me.chartType = me.changingCard.dataset.chartType;

        // Load the configuration out of the chart map in the data handler
        this.load();

        // Show the overlay
        document.querySelector("[data-overlay='configure']").classList.add("overlay--visible");
    },


    /**
     * Close the overlay if the close button was clicked
     *
     * @param e event
     */
    onClickCloseOverlay: function (e) {
        // Hide the overlay
        document.querySelector("[data-overlay='configure']").classList.remove("overlay--visible");

        // clear the node list of data types
        this.clearList();
    },


    /**
     * Close the overlay if the darkened background was clicked
     *
     * @param e event
     */
    onClickOverlayContainer: function (e) {
        // check if clicked element is outside the overlay -> close on click in the darkened area
        if (e["srcElement"].classList.contains("overlay--container"))
            this.onClickCloseOverlay(e);
    },


    /**
     * Save the chart type if the select dropdown changed
     *
     * @param e event
     */
    onChangeChartType: function (e) {
        e.preventDefault();
        let me = this;

        // Chart-types select
        let chartTypeSelect = document.getElementById("chart-configuration-chart-type");

        // Set chart-type
        switch (chartTypeSelect.value) {
            case "gauge-chart":
                // Set Chart to gauge-chart
                app.chartDataHandler.chartBuffers[me.chartId].chart = new GaugeChart(me.changingCard.querySelector('.media > svg'));
                break;
            case "number-chart":
                // Set Chart to number-chart
                app.chartDataHandler.chartBuffers[me.chartId].chart = new NumberChart(me.changingCard.querySelector('.media > svg'));
                break;
            case "line-chart":
            default:
                // Set Chart to line-chart
                app.chartDataHandler.chartBuffers[me.chartId].chart = new LineChart(me.changingCard.querySelector('.media > svg'));
                chartTypeSelect.value = "line-chart";
        }

        // Set chart-type to card
        me.changingCard.dataset.chartType = chartTypeSelect.value;
    },


    /**
     * Add a data type to the list in the overlay
     *
     * @param id int
     * @param label string
     */
    addDataTypeToList: function (id, label) {
        document.getElementsByClassName('list--data-types')[0].innerHTML +=
            `<li>${label}<i data-id="${id}" class="material-icons data-type--delete">close</i></li>`;
    },


    /**
     * Removes a data type from the list in the overlay
     *
     * @param id int
     */
    removeDataTypeFromList: function (id) {
        document.querySelector(`[data-id="${id}"]`).parentNode.remove();
    },


    /**
     * Removes all elements in the list in the overlay (clearing on close)
     */
    clearList: function () {
        document.querySelector('.list--data-types').innerHTML = '';
    },


    /**
     * Select the chart type in the dropdown
     */
    selectChartType: function (chartType) {
        let options = document.getElementById("chart-configuration-chart-type").options;
        Array.prototype.forEach.call(options, (element) => {
            if (element.value === chartType) {
                element.selected = true;
            }
        });
    },


    /**
     * Load chart configuration out of the data-handler
     */
    load: function () {
        // If chart config exists
        if (app.chartDataHandler.chartBuffers[this.chartId]) {

            // ChartMap contains all data types displayed in the chart
            let chartMap = app.chartDataHandler.chartBuffers[this.chartId].chart.chartMap || [];

            // If data types are set, loop through them and display them in the list of added data types
            if (chartMap.length !== 0) {
                for (let i = 0; i < chartMap.length; i++) {
                    this.addDataTypeToList(chartMap[i], dataTypes[chartMap[i]].translation);
                }
            }

            // Preselect the chart type
            this.selectChartType(this.chartType);

            // Load interval time to form
            document.getElementById("chart-configuration-interval").value =
                app.chartDataHandler.chartBuffers[this.chartId].intervalTime;
        }
    },


    /**
     * On change the chart buffer interval time:
     * update interval of buffer to refresh chart values in different interval
     * @param e
     */
    onChangeChartBufferInterval: function (e) {
        let me = this;

        // New interval time in ms
        let timerInterval = e.target.value;

        // Update buffer
        app.chartDataHandler.chartBuffers[me.chartId].changeInterval(timerInterval);
    },


    /**
     * Load the data-types from dataTypes.config.js into the form
     * For each data-type there is generated an entry in the select-element
     * '.chart-configuration-data-type'
     */
    loadDataTypes() {
        let me = this;

        // Select the select element
        let dataTypeConfigSelect = document.getElementById('chart-configuration-data-type');

        // Iterate through the Object of data-types
        Object.keys(dataTypes).forEach((dataTypeId) => {

            // Create the entry for the select list
            let optionElement = document.createElement("option");
            optionElement.setAttribute('value', dataTypeId);
            optionElement.appendChild(document.createTextNode(dataTypes[dataTypeId]['translation']));

            // Append the element to the list
            dataTypeConfigSelect.appendChild(optionElement);

        });
    }
};