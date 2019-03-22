function DataHandler() {

    // Contains all charts ordered by chartId
    this.charts = [];

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

        console.log(data);

        console.log(me.charts);

        // Loop through all charts and look for the data type in the map
        for (let i = 0; i < me.charts.length; i++) {
            for (let j = 0; j < me.charts[i].chartMap.length; j++) {
                // If the data type is defined for the chart, push the received value to it
                if (mappedData[data[0]] === me.charts[i].chartMap[j]) {
                    me.charts[i].push(data[1]);
                }
            }
        }
    };
}
