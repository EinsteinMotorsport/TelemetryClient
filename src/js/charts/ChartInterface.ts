/**
 * Interface a chart-type has to implement
 *
 * @interface
 */
export default interface ChartInterface {
    chartMap: string[];
    period?: number;

    getName(): string;
    init(): void;
    addDataType(dataType: string): void;
    removeDataType(dataType: string): void;
    push(dataType: string, value: number): void;
    getSamplingTime(): number;
    setSamplingTime(time: number): void;
    hasPeriod(): boolean;
    changePeriod?(period: number): void;
}
