function DataHandler() {

    /**
     * Contains all charts ordered by chartId
     *
     * @type {ChartBuffer[]}
     */
    this.chartBuffers = [];


    // Data pushed to handle
    this.push = function (json) {
        let me = this;

        // Parsed Json from the server
        let data = JSON.parse(json);

        // Maps the response (data-type id) to the different identities
        let dataMap = {};
        Object.getOwnPropertyNames(dataTypes).forEach(key => {
            dataMap[dataTypes[key].id] = key;
        });


        // Loop through all charts and look for the data type in the map
        for (let i = 0; i < me.chartBuffers.length; i++) {
            for (let j = 0; j < me.chartBuffers[i].chart.chartMap.length; j++) {
                // If the data type is defined for the chart, push the received value to it
                if (dataMap[data[0]] === me.chartBuffers[i].chart.chartMap[j]) {
                    me.chartBuffers[i].push(dataTypes[me.chartBuffers[i].chart.chartMap[j]].id, data[1]);
                }
            }
        }

    };
}
