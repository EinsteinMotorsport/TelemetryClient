chartConfiguration = {

    mediaType: null,

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
    },

    onClickOpenOverlay: function (e) {
        let me = this;

        // Save the card which is currently edited to the object
        me.changingCard = e.target.closest('.card');

        // The media-type of the chart from da cards data-attributes
        chartConfiguration.mediaType = me.changingCard.dataset.mediaType;

        // Preselect current selection in the dropdown
        document.getElementById("chart-configuration-media-type").value = chartConfiguration.mediaType;

        // Show the overlay
        document.querySelector("[data-overlay='configure']").classList.add("overlay--visible");
    },

    onClickCloseOverlay: function (e) {
        // Hide the overlay
        document.querySelector("[data-overlay='configure']").classList.remove("overlay--visible");
    },

    onClickOverlayContainer: function (e) {
        // check if clicked element is outside the overlay -> close on click in the darkened area
        if (e.srcElement.classList.contains("overlay--container"))
            this.onClickCloseOverlay(e);
    },

    onClickChartConfigurationSave: function (e) {
        e.preventDefault();
        let me = this;

        // Store the dropdown element into a variable
        let mediaTypeSelect = document.getElementById("chart-configuration-media-type");

        // Get the selected value from the dropdown
        chartConfiguration.mediaType = mediaTypeSelect.value;

        // Set the headline of the card to the text of the selected option
        me.changingCard.querySelector('.header-text').innerHTML =
            mediaTypeSelect.options[mediaTypeSelect.selectedIndex].text;


        // Remove chart from the datahandler to prevent multiple links
        app.chartDataHandler.chartMap[me.changingCard.dataset.mediaType].forEach((chart, key) => {
            if (chart.element === me.changingCard.querySelector('.media > svg')) {
                delete app.chartDataHandler.chartMap[me.changingCard.dataset.mediaType][key];
            }
        });

        // Update the datahandler and add the selected values to the graph
        app.chartDataHandler.chartMap[chartConfiguration.mediaType]
            .push(new LineChart(me.changingCard.querySelector('.media > svg')));

        // Change the data-attribute of the card to the selected media-type
        me.changingCard.dataset.mediaType = chartConfiguration.mediaType;

        // Hide the overlay
        me.onClickCloseOverlay();
    },
};