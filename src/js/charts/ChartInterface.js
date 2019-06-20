let required = function () {throw new Error('Interface not implemented')};

/**
 * Interface a chart-type has to implement
 *
 * @interface
 */
const ChartInterface = {
    init: required,
    addDataType: required,
    removeDataType: required,
    push: required,
    getSamplingTime: required,
    setSamplingTime: required,
    hasPeriod: required,
};
