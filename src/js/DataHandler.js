function DataHandler() {

    // Mapping to know which chart shows which data
    this.chartMap = {
        'speed': null,
        'acceleration': null,
        'oilPressure': null,
    };

    // Data pushed to handle
    this.push = function (json) {
        var me = this;

        // Parsed Json from the server
        data = JSON.parse(json);

        // Maps the response to the different identities
        mappedData = {
            "speed": data[0],
            "acceleration": data[1],
            "oilPressure": data[2],
        };

        // Loop through the data and push it to the deposited chart
        for (var prop in mappedData) {
            if (!mappedData.hasOwnProperty(prop)) continue;

            if (typeof me.chartMap[prop] === 'object' && me.chartMap[prop] !== null) {
                me.chartMap[prop].push(mappedData[prop]);
            }
        }

    }
}
