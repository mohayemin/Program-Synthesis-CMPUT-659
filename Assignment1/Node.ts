
export abstract class Node {
    abstract interpret(env: any): number | boolean
}

export class NotNode extends Node {
    constructor(public left: Node) {
        super()
    }

    toString() {
        return 'not (' + this.left + ')'
    }

    interpret(env: any) {
        return !this.left.interpret(env);
    }
}

export class AndNode extends Node {
    constructor(public left: Node, public right: Node) {
        super();
    }

    toString() {
        return "(" + this.left.toString() + " and " + this.right.toString() + ")"
    }

    interpret(env: any) {
        return this.left.interpret(env) && this.right.interpret(env)
    }
}

export class LessThanNode extends Node {
    constructor(public left: Node, public right: Node) {
        super();
    }

    toString() {
        return "(" + this.left.toString() + " < " + this.right.toString() + ")"
    }

    interpret(env) {
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
        return "(if" + this.condition.toString() + " then " + this.true_case.toString() + " else " + this.false_case.toString() + ")"
    }

    interpret(env) {
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
    interpret(env) {
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

    interpret(env) {
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

    abstract operate(leftVal, rightVal): number;
    interpret(env) {
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

export class Times extends ArithmaticNode {
    constructor(left: Node, right: Node) {
        super(left, right, '*')
    }

    operate(leftVal: number, rightVal: number) {
        return leftVal * rightVal
    }
}
