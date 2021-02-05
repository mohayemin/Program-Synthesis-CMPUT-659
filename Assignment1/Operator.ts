import { Grammar } from "./Grammar";
import { AndNode, BooleanNode, IfElseNode, LessThanNode, Node, NotNode, NumNode, PlusNode, TimesNode, VarNode } from "./Node";

export interface Operator {
    accepts(...operands: Node[]): boolean
    grow(plist: Node[], grammar: Grammar): Node[]
    createNode(...components: Node[]): Node
}

export abstract class BooleanOperator implements Operator {
    constructor(private operandCount: number) {
    }

    accepts(...operands: Node[]): boolean {
        return operands.length === this.operandCount &&
            operands.every(o => this.acceptsOperand(o))
    }

    protected abstract acceptsOperand(operand: Node): boolean
    abstract createNode(...components: Node[]): Node
    grow(plist: Node[], grammar: Grammar): Node[] {
        const outPList: Node[] = [];
        for (const pi of plist) {
            for (const pj of plist) {
                if (this.accepts(pi, pj))
                    outPList.push(this.createNode(pi, pj))
            }
        }

        return outPList
    }
}

export class AndOperator extends BooleanOperator {
    constructor() {
        super(2)
    }

    acceptsOperand(operand: Node): boolean {
        return operand instanceof BooleanNode
    }

    createNode(...nodes: Node[]): Node {
        return new AndNode(nodes[0] as BooleanNode, nodes[1] as BooleanNode)
    }
}

export class LessThanOperator extends BooleanOperator {
    constructor() {
        super(2)
    }

    acceptsOperand(operand: Node) {
        return operand instanceof VarNode ||
            operand instanceof NumNode ||
            operand instanceof PlusNode ||
            operand instanceof TimesNode
    }

    createNode(...children: Node[]): Node {
        return new LessThanNode(children[0], children[1])
    }
}

export class NotOperator extends BooleanOperator {
    constructor() {
        super(1);
    }
    protected acceptsOperand(operand: Node): boolean {
        return operand instanceof BooleanNode
    }
    createNode(...components: Node[]): Node {
        return new NotNode(components[0] as BooleanNode)
    }
}

export class IfThenElseOperator implements Operator {
    grow(plist: Node[], grammar: Grammar): Node[] {
        const newPrograms: Node[] = [];
        for (const first of plist) {
            for (const second of plist) {
                for (const bo of grammar.booleanOperations) {
                    if (bo.accepts(first, second)) {
                        newPrograms.push(new IfElseNode(bo.createNode(first, second), first, second))
                    }
                }
            }
        }

        return newPrograms
    }
    accepts(...operands: Node[]): boolean {
        if (operands.length != 3)
            return false

        return operands[0] instanceof AndNode ||
            operands[0] instanceof NotNode ||
            operands[0] instanceof LessThanNode
    }
    createNode(...nodes: Node[]): Node {
        return new IfElseNode(nodes[0], nodes[1], nodes[2])
    }
}

export abstract class ArithmeticOperator implements Operator {
    acceptsOperand(operand: Node) {
        return operand instanceof VarNode ||
            operand instanceof NumNode ||
            operand instanceof PlusNode ||
            operand instanceof TimesNode
    }

    accepts(...operands: Node[]): boolean {
        return operands.length == 2 &&
            this.acceptsOperand(operands[0]) &&
            this.acceptsOperand(operands[1])
    }

    grow(plist: Node[], grammar: Grammar): Node[] {
        const newPrograms = []
        for (let i = 0; i < plist.length; i++) {
            const pi = plist[i]
            for (let j = i; j < plist.length; j++) {
                // started from j = i to optimize
                // plus/times operation is symmetric. 
                // x+y and y+x are equivalent
                // x*y and y*x are equivalent
                const pj = plist[j]
                if (this.accepts(pi, pj)) {
                    newPrograms.push(this.createNode(pi, pj))
                }
            }
        }

        return newPrograms
    }

    abstract createNode(...components: Node[]): Node;
}

export class PlusOperator extends ArithmeticOperator {
    createNode(...components: Node[]): Node {
        return new PlusNode(components[0], components[1])
    }
}

export class TimesOperator extends ArithmeticOperator {
    createNode(...components: Node[]): Node {
        return new TimesNode(components[0], components[1])
    }
}