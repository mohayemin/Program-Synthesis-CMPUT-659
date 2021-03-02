export let cacheHitCount = 0
export abstract class Node {
    constructor(public cost: number) { }
    abstract toString(): string
    abstract interpret(input: string): string
}

export class Str extends Node {
    constructor(public value: string, cost: number) {
        super(cost)
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
    constructor(cost: number) {
        super(cost)
    }
    toString() {
        return 'arg'
    }
    interpret(input: string) {
        return input
    }
}

export class Concat extends Node {
    constructor(public x: Node, public y: Node, baseCost: number) {
        super(baseCost + x.cost + y.cost)
    }
    toString() {
        return `concat(${this.x}, ${this.y})`
    }
    interpret(input: string) {
        return this.x.interpret(input) + this.y.interpret(input)
    }
}

export class Replace extends Node {
    private resultCache: object = {}
    constructor(public str: Node, public search: Node, public replacement: Node, baseCost: number) {
        super(baseCost + str.cost + search.cost + replacement.cost)
    }
    toString() {
        return `${this.str}.replace(${this.search}, ${this.replacement})`
    }
    interpret(input: string) {
        if (!(input in this.resultCache)) {
            this.resultCache[input] = this.str.interpret(input).replace(this.search.interpret(input), this.replacement.interpret(input))
        } else {
            cacheHitCount++
        }

        return this.resultCache[input]
    }
}

