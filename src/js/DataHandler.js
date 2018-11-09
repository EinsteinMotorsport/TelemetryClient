function DataHandler() {

    this.chartMap = {
        'speed': null,
        'acceleration': null,
        'oilPressure': null,
    };

    this.push = function (json) {

        var me = this;

        data = JSON.parse(json);

        mappedData = {
            "speed": data[0],
            "acceleration": data[1],
            "oilPressure": data[2],
        };

        for (var prop in mappedData) {
            if (!mappedData.hasOwnProperty(prop)) continue;

            console.log(me.chartMap[prop]);

            if (typeof me.chartMap[prop] === 'object' && me.chartMap[prop] !== null) {
                me.chartMap[prop].push(mappedData[prop]);
            }
        }

    }
}
