import { IO } from "./ProbGrammar"

export const cache = {
    hit: 0,
    miss: 0
}
export abstract class Node {
    public solvedInputs: string[]
    constructor(public name: string, public components: Node[], public cost: number) {

    }
    abstract toString(): string
    abstract interpret(input: string): string
    abstract size(): number

    verify(ioSet: IO[]): boolean {
        this.solvedInputs = ioSet.filter(io => this.interpret(io.in) === io.out).map(io => io.in)
        return this.solvedInputs.length === ioSet.length
    }
    isPartialSolution() {
        return this.solvedInputs.length > 0
    }

    hasRule(name: string) {
        if (this.name === name)
            return true

        return this.components.some(c => c.hasRule(name))
    }
}

export class Str extends Node {
    constructor(public value: string, cost: number) {
        super(value, [], cost)
        this.value = value
    }
    toString() {
        return `'${this.value}'`
    }
    interpret(input: string) {
        return this.value
    }
    size() {
        return 1
    }
}

export class Argument extends Node {
    constructor(cost: number) {
        super('Argument', [], cost)
    }
    toString() {
        return 'arg'
    }
    interpret(input: string) {
        return input
    }
    size() {
        return 1
    }
}

export abstract class FunctionNode extends Node {
    private resultCache: object = {}

    interpret(input: string) {
        if (!(input in this.resultCache)) {
            this.resultCache[input] = this.interpretImpl(input)
            cache.miss++
        } else {
            cache.hit++
        }

        return this.resultCache[input]
    }

    protected abstract interpretImpl(input: string): string

    _size: number = 0
    size() {
        this._size = this._size || this.sizeImpl()
        return this._size
    }

    protected abstract sizeImpl(): number
}

export class Concat extends FunctionNode {
    constructor(public x: Node, public y: Node, cost: number) {
        super('Concat', [x, y], cost)
    }
    toString() {
        return `concat(${this.x},${this.y})`
    }
    interpretImpl(input: string) {
        return this.x.interpret(input) + this.y.interpret(input)
    }
    sizeImpl() {
        return this.x.size() + this.y.size() + 1
    }
}

export class Replace extends FunctionNode {
    constructor(public str: Node, public search: Node, public replacement: Node, cost: number) {
        super('Replace', [str, search, replacement], cost)
    }
    toString() {
        return `replace(${this.str},${this.search},${this.replacement})`
    }
    interpretImpl(input: string) {
        return this.str.interpret(input).replace(this.search.interpret(input), this.replacement.interpret(input))
    }
    sizeImpl() {
        return this.str.size() + this.search.size() + this.replacement.size() + 1
    }
}

