export abstract class Node {
    size: number
    getSize() {
        return this.size
    }
    abstract toString(): string
    abstract interpret(input: string): string
}

export class Str extends Node {
    constructor(public value: string) {
        super()
        this.value = value
    }
    toString() {
        return `'${this.value}'`
    }
    interpret(input: string) {
        return this.value
    }
}

export class Argument extends Node {
    constructor() {
        super()
    }
    toString() {
        return 'arg'
    }
    interpret(input: string) {
        return input
    }
}

export class Concat extends Node {
    constructor(public x: Node, public y: Node) {
        super()
    }
    toString() {
        return `concat(${this.x}, ${this.y})`
    }
    interpret(input: string) {
        return this.x.interpret(input) + this.y.interpret(input)
    }
}

export class Replace extends Node {
    constructor(public str: Node, public search: Node, public replacement: Node) {
        super()
    }
    toString() {
        return `${this.str}.replace(${this.search}, ${this.replacement})`
    }
    interpret(input: string) {
        return this.str.interpret(input).replace(this.search.interpret(input), this.replacement.interpret(input))
    }
}

