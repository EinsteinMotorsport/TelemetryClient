function DataHandler() {

    // Mapping to know which chart shows which data
    this.chartMap = {
        'speed': [],
        'acceleration': [],
        'oilPressure': [],
    };

    // Data pushed to handle
    this.push = function (json) {
        let me = this;

        // Parsed Json from the server
        let data = JSON.parse(json);

        // Maps the response to the different identities
        let mappedData = {
            0 : "speed",
            1 : "acceleration",
            2 : "oilPressure",
        };

        // Push the sended value to the charts
        let charts = me.chartMap[mappedData[data[0]]];
        if (Array.isArray(charts)) {
            charts.forEach((chart) => {
                chart.push(data[1]);
            });
        }
    };
}
