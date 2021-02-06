import { Grammar } from "./Grammar";
import { Env, Node } from "./Node";
import { Operator } from "./Operator";

export class BreadthFirstSearch {
    synthesize(grammar: Grammar): Node {
        return null
    }
}

export interface BFSNode {
    children(grammar: Grammar): BFSNode[]
    isTerminal(): boolean
    clone(): BFSNode
}

export class BFSCompositeNode implements BFSNode {
    private firstSymbolIndex: number
    private parts: BFSNode[]
    constructor(private operator: Operator, ...parts: BFSNode[]) {
        this.parts = parts
        this.firstSymbolIndex = this.parts.findIndex(p => !p.isTerminal())
    }

    children(grammar: Grammar): BFSNode[] {
        if (this.firstSymbolIndex < 0)
            return []
        const replacements = this.parts[this.firstSymbolIndex].children(grammar)
        const children = []
        for (const replacement of replacements) {
            const child = this.clone() as BFSCompositeNode
            child.parts[this.firstSymbolIndex] = replacement
            children.push(child)
        }
        return children
    }

    isTerminal() {
        return !!this.firstSymbolIndex
    }

    clone() {
        const partClones = this.parts.map(p => p.clone())
        return new BFSCompositeNode(this.operator, ...partClones)
    }
    toString() {
        return this.operator.stringify(...this.parts)
    }
}

export class BFSBooleanSymbolNode implements BFSNode {
    children(grammar: Grammar): BFSNode[] {
        return grammar.booleanOperations.map(op => op.createDefaultBFSNode())
    }
    isTerminal(): boolean {
        return false
    }
    clone(): BFSNode {
        return new BFSBooleanSymbolNode()
    }
    toString() {
        return 'B'
    }
}

export class BFSNumberSymbolNode implements BFSNode {
    constructor() {

    }

    isTerminal(): boolean {
        return false
    }

    children(grammar: Grammar): BFSNode[] {
        const valueChildren = grammar.values.map(v => new BFSValueNode(v))
        const variableChildren = grammar.variables.map(v => new BFSVariableNode(v))
        const symbolChildren = grammar.integerOperations.map(op => op.createDefaultBFSNode())
        return [].concat(valueChildren, variableChildren, symbolChildren)
    }

    clone() {
        return new BFSNumberSymbolNode()
    }

    toString() {
        return 'S'
    }
}

export class BFSValueNode implements BFSNode {
    constructor(public value: number) { }

    children(grammar: Grammar): BFSNode[] {
        return []
    }

    isTerminal(): boolean {
        return true
    }

    clone() {
        return new BFSValueNode(this.value)
    }

    toString() {
        return this.value + ''
    }
}

export class BFSVariableNode implements BFSNode {
    constructor(public variable: string) { }

    children(grammar: Grammar): BFSNode[] {
        return []
    }

    isTerminal(): boolean {
        return true
    }

    clone() {
        return new BFSVariableNode(this.variable)
    }

    toString() {
        return this.variable
    }
}
