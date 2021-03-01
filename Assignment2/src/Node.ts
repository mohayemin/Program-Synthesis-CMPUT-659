export type Env = { [name: string]: string }

export abstract class Node {
    size: number
    getSize() {
        return this.size
    }
    abstract toString(): string
    abstract interpret(env: Env): string
}

export class Str extends Node {
    constructor(public value: string) {
        super()
        this.value = value
    }
    toString() {
        return `'${this.value}'`
    }
    interpret(env: Env) {
        return this.value
    }
}

export class Var extends Node {
    constructor(public name: string) {
        super()
    }
    toString() {
        return this.name
    }
    interpret(env: Env) {
        return env[this.name]
    }
}

export class Concat extends Node {
    constructor(public x: Node, public y: Node) {
        super()
    }
    toString() {
        return `concat(${this.x}, ${this.y})`
    }
    interpret(env: Env) {
        return this.x.interpret(env) + this.y.interpret(env)
    }
}

export class Replace extends Node {
    constructor(public str: Node, public search: Node, public replacement: Node) {
        super()
    }
    toString() {
        return `${this.str}.replace(${this.search}, ${this.replacement})`
    }
    interpret(env: Env) {
        return this.str.interpret(env).replace(this.search.interpret(env), this.replacement.interpret(env))
    }
}
