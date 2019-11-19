declare interface Number {
    isNumeric(n: any): boolean
}


declare interface Array<T> {
    shuffle(): void,

    size(): number
}


declare interface String {
    capitalize(): void;

    kebabToCamelCase(): void;
}


declare interface NodeList {
    on(event: any, callback: Function): void
}

declare interface HTMLCollection {
    on(event: any, callback: Function): void
}

declare interface HTMLCollectionOf<T extends Element> {
    on(event: any, callback: Function): void
}

declare interface Element {
    on(event: any, callback: Function): void
}