import { AndNode, IfElseNode, LessThanNode, Node, NotNode, NumNode, PlusNode, Times, VarNode } from "./Node";

export interface Operator {
    accepts(...operands: Node[]): boolean;
    createNode(...nodes: Node[]): Node;
}

export abstract class DefaultOperator implements Operator {
    constructor(private operandCount: number) {
    }


    accepts(...operands: Node[]): boolean {
        return operands.length === this.operandCount &&
            operands.every(o => this.acceptsOperand(o))
    }

    abstract acceptsOperand(operand: Node): boolean

    abstract createNode(...nodes: Node[]): Node;
}

export class AndOperator extends DefaultOperator {
    constructor() {
        super(2)
    }
    acceptsOperand(operand: Node): boolean {
        return operand instanceof LessThanNode
    }

    createNode(...nodes: Node[]): Node {
        return new AndNode(nodes[0], nodes[1])
    }
}

export class LessThanOperator extends DefaultOperator {
    constructor() {
        super(2)
    }

    acceptsOperand(operand: Node) {
        return operand instanceof VarNode ||
            operand instanceof NumNode ||
            operand instanceof PlusNode ||
            operand instanceof Times
    }

    createNode(...nodes: Node[]): Node {
        return new LessThanNode(nodes[0], nodes[1])
    }
}

export class IfThenElseOperator implements Operator {

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