let required = function () {throw new Error('Interface not implemented')};

/**
 * Interface a chart-type has to implement
 *
 * @interface
 */
let ChartInterface = {
    init: required,
    addDataType: required,
    removeDataType: required,
    push: required,
};
