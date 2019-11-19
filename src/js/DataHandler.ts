import ChartBuffer from "./ChartBuffer";
import {dataTypes} from "./dataTypes.config";

export default class DataHandler {
    /**
     * Contains all charts ordered by chartId
     */
    chartBuffers: ChartBuffer[] = [];


    // Data pushed to handle
    push = function (json: string) {
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
                    console.log("j", j);
                    console.log("chartBuffers", me.chartBuffers[i].chart.chartMap);
                    me.chartBuffers[i].push(me.chartBuffers[i].chart.chartMap[j], data[1]);
                }
            }
        }

    };
}
