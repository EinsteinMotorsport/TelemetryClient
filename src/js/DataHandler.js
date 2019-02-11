function DataHandler() {

    // Mapping to know which chart shows which data
    this.chartMap = {
        'speed': null,
        'acceleration': null,
        'oilPressure': null,
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

        // Push the sended value to the chart
        me.chartMap[mappedData[data[0]]].push(data[1]);
    };
}
