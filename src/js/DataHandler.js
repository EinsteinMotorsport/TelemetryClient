function DataHandler() {

    /**
     * Contains all charts ordered by chartId
     *
     * @type {ChartInterface[]}
     */
    this.charts = [];

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
        for (let i = 0; i < me.charts.length; i++) {
            for (let j = 0; j < me.charts[i].chartMap.length; j++) {
                // If the data type is defined for the chart, push the received value to it
                if (dataMap[data[0]] === me.charts[i].chartMap[j]) {
                    console.log("chart", me.charts[i]);
                    console.log("data-type", me.charts[i].chartMap[j]);
                    console.log("matched data-type-id", dataTypes[me.charts[i].chartMap[j]].id);
                    me.charts[i].push(dataTypes[me.charts[i].chartMap[j]].id, data[1]);
                }
            }
        }

    };
}
