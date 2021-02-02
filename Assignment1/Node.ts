import { type } from "os";
import { Grammar } from "./Grammar";

export abstract class Node {
    abstract interpret(env: any): number | boolean
    abstract grow(plist: Node[], grammar: Grammar): Node[]
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

    grow() {
        // assumption: all items are LT

        // Does not grow because it never produces programs which
        // has more nodes than previous layer
        // See 1b of the assignment description for detail
        return []
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

    grow(plist: Node[]) {
        if (plist.length <= 1)
            return []
        // do the other things
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

    grow(plist) { return [] }
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

    grow(plist: Node[], grammar: Grammar) {
        const outPList: Node[] = [];
        for (const bo of grammar.booleanOperations) {
            for (const pi of plist) {
                for (const pj of plist) {
                    if (bo.accepts(pi, pj)) {
                        outPList.push(new IfElseNode(bo.createNode(pi, pj), pi, pj))
                    }
                }
            }
        }

        return outPList;
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

    grow(plist, new_plist) { return [] }
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

    grow(plist, new_plist) { return [] }
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

    abstract createNew(newLeft: Node, newRight: Node): Node;

    grow(plist: Node[]) {
        const outPList = [];
        for (let i = 0; i < plist.length; i++) {
            const pi = plist[i];
            for (let j = i; j < plist.length; j++) {
                const pj = plist[j];
                if (pi instanceof NumNode && pj instanceof NumNode)
                    continue

                outPList.push(this.createNew(pi, pj))
            }
        }

        return outPList;
    }
}

export class PlusNode extends ArithmaticNode {
    constructor(left: Node, right: Node) {
        super(left, right, '+')
    }

    operate(leftVal: number, rightVal: number) {
        return leftVal + rightVal
    }

    createNew(newLeft: Node, newRight: Node) {
        return new PlusNode(newLeft, newRight)
    }
}

export class Times extends ArithmaticNode {
    constructor(left: Node, right: Node) {
        super(left, right, '*')
    }

    operate(leftVal: number, rightVal: number) {
        return leftVal * rightVal
    }

    createNew(newLeft: Node, newRight: Node) {
        return new Times(newLeft, newRight)
    }
}

type NodeClass = new (...args: any[]) => Node