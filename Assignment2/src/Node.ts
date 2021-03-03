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

export abstract class FunctionNode extends Node {
    private resultCache: object = {}
    interpret(input: string) {
        if (!(input in this.resultCache)) {
            this.resultCache[input] = this.interpretImpl(input)
        } else {
            cacheHitCount++
        }

        return this.resultCache[input]
    }

    protected abstract interpretImpl(input: string): string
}

export class Concat extends FunctionNode {
    constructor(public x: Node, public y: Node, cost: number) {
        super(cost)
    }
    toString() {
        return `concat(${this.x},${this.y})`
    }
    interpretImpl(input: string) {
        return this.x.interpret(input) + this.y.interpret(input)
    }
}

export class Replace extends FunctionNode {
    constructor(public str: Node, public search: Node, public replacement: Node, cost: number) {
        super(cost)
    }
    toString() {
        return  `replace(${this.str},${this.search},${this.replacement})`
    }
    interpretImpl(input: string) {
        return this.str.interpret(input).replace(this.search.interpret(input), this.replacement.interpret(input))
    }
}

