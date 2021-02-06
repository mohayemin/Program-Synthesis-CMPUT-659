import { Grammar } from "./Grammar";
import { Node } from "./Node";
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
}

export class BFSBooleanSymbolNode implements BFSNode {
    children(grammar: Grammar): BFSNode[] {
        return grammar.booleanOperations.map(op => op.createDefaultBFSNode())
    }
    isTerminal(): boolean {
        return true
    }
    clone(): BFSNode {
        return new BFSBooleanSymbolNode()
    }

}

export class BFSNumberSymbolNode implements BFSNode {
    constructor() {

    }

    isTerminal(): boolean {
        return false
    }

    children(grammar: Grammar): BFSNode[] {
        const valueChildren = grammar.values.map(v => new BFSValueNode())
        const variableChildren = grammar.variables.map(v => new BFSVariableNode())
        const symbolChildren = grammar.integerOperations.map(op => op.createDefaultBFSNode())
        return [].concat(valueChildren, variableChildren, symbolChildren)
    }

    clone() {
        return new BFSNumberSymbolNode()
    }
}

export class BFSValueNode implements BFSNode {
    children(grammar: Grammar): BFSNode[] {
        return []
    }

    isTerminal(): boolean {
        return true
    }

    clone() {
        return new BFSValueNode()
    }
}

export class BFSVariableNode implements BFSNode {
    children(grammar: Grammar): BFSNode[] {
        return []
    }
    isTerminal(): boolean {
        return true
    }

    clone() {
        return new BFSVariableNode()
    }
}
