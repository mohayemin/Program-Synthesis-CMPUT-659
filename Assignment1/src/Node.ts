
export interface Env {
    x: number
    y: number
    out: number
}

export abstract class Node {
    abstract interpret(env: Env): number
}

export abstract class BooleanNode extends Node {
    abstract interpretBool(env: Env): boolean

    interpret(env: Env) {
        const bool = this.interpretBool(env)
        return bool ? 1 : 0
    }
}

export class NotNode extends BooleanNode {
    constructor(public left: BooleanNode) {
        super()
    }

    toString() {
        return '!' + this.left
    }

    interpretBool(env: Env) {
        return !this.left.interpretBool(env)
    }
}
export class AndNode extends BooleanNode {
    constructor(public left: BooleanNode, public right: BooleanNode) {
        super();
    }

    toString() {
        return `(${this.left.toString()} & ${this.right.toString()})`
    }

    interpretBool(env: Env) {
        return this.left.interpretBool(env) && this.right.interpretBool(env)
    }
}

export class LessThanNode extends BooleanNode {
    constructor(public left: Node, public right: Node) {
        super();
    }

    toString() {
        return `(${this.left.toString()} < ${this.right.toString()})`
    }

    interpretBool(env: Env) {
        return this.left.interpret(env) < this.right.interpret(env)
    }
}

export class IfElseNode extends Node {
    constructor(
        public condition: Node,
        public true_case: Node,
        public false_case: Node) {
        super();
    }

    toString() {
        return `(${this.condition.toString()} ? ${this.true_case.toString()} : ${this.false_case.toString()})`
    }

    interpret(env: Env) {
        if (this.condition.interpret(env))
            return this.true_case.interpret(env)
        else
            return this.false_case.interpret(env)
    }
}

export class NumNode extends Node {
    constructor(public value: number) {
        super();
    }

    toString() {
        return "" + this.value
    }
    interpret(_env: Env) {
        return this.value
    }
}

export class VarNode extends Node {
    constructor(public name: string) {
        super();
    }

    toString() {
        return this.name
    }

    interpret(env: Env) {
        return env[this.name]
    }
}

export abstract class ArithmaticNode extends Node {
    constructor(public left: Node, public right: Node, public symbol: string) {
        super();
        this.left = left
        this.right = right
        this.symbol = symbol
    }

    abstract operate(leftVal: number | boolean, rightVal: number | boolean): number;
    interpret(env: Env) {
        return this.operate(this.left.interpret(env), this.right.interpret(env))
    }

    toString() {
        return `(${this.left} ${this.symbol} ${this.right})`
    }
}

export class PlusNode extends ArithmaticNode {
    constructor(left: Node, right: Node) {
        super(left, right, '+')
    }

    operate(leftVal: number, rightVal: number) {
        return leftVal + rightVal
    }
}

export class TimesNode extends ArithmaticNode {
    constructor(left: Node, right: Node) {
        super(left, right, '*')
    }

    operate(leftVal: number, rightVal: number) {
        return leftVal * rightVal
    }
}
