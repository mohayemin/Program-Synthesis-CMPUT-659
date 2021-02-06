import { Grammar } from "./Grammar";
import { Node } from "./Node";

export class BreadthFirstSearch {
    synthesize(grammar: Grammar): Node {
        return null
    }
}

export interface BFSNode {
    children(grammar: Grammar): BFSNode[]
    isTerminal(): boolean
}

export class BFSCompositeNode {
    private firstNonTerminalNode: BFSNode
    constructor(private parts: BFSNode[]) {
        this.firstNonTerminalNode =  this.parts.find(p => !p.isTerminal())
    }
    children(grammar: Grammar): BFSNode[] {
        if(!this.firstNonTerminalNode)
            return []
        const children = grammar.allOperations.flatMap(op => op.expand(this.firstNonTerminalNode, grammar))
        return children
    }
    isTerminal() {
        return !!this.firstNonTerminalNode
    }
}

export class BFSSymbolNode {
    constructor(private replacements: BFSNode[]) {
        
    }

    children(grammar: Grammar): BFSNode[] {
        return this.replacements
    }
}