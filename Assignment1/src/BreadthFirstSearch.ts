import { Grammar } from "./Grammar";
import { Env } from "./Node";
import { Operator } from "./Operator";
import { SearchResult } from "./SearchResult";

export class BreadthFirstSearch {
    constructor(private grammar: Grammar) {

    }
    synthesize(): SearchResult {
        const startTime = Date.now()
        let nextLogCount = 100000

        let programsEvaluated = 0
        let programsGenerated = 1
        const start = new BFSNumberSymbolNode()
        start['wbs'] = '1'
        const openList: BFSNode[] = [start]

        while (openList.length) {
            //console.log(openList.join(','))
            const program = openList.shift()
            if (program.size() > this.grammar.maxSize)
                continue

            // console.log(prog['wbs'] + ' ' + prog.toString())
            if (program.isTerminal()) {
                programsEvaluated++
                if (this.grammar.isBFSCorrect(program)) {
                    return {
                        program,
                        programsEvaluated,
                        programsGenerated,
                        executionDurationMs: Date.now() - startTime
                    }
                }
            }

            const children = program.children(this.grammar)
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child['wbs'] = `${program['wbs']}.${i + 1}`
                openList.push(child)
            }
            programsGenerated += children.length

            if (programsGenerated >= nextLogCount) {
                console.log(`Generated ${Math.floor(programsGenerated/1000)}K programs and running...`)
                nextLogCount += 100000
            }
        }

        return null
    }
}

export interface BFSNode {
    size(): number
    interpret(env: Env): number
    children(grammar: Grammar): BFSNode[]
    isTerminal(): boolean
    clone(): BFSNode
    toString(): string
}

export class BFSCompositeNode implements BFSNode {
    private parts: BFSNode[]
    constructor(private operator: Operator, ...parts: BFSNode[]) {
        this.parts = parts
    }

    children(grammar: Grammar): BFSNode[] {
        if (this.isTerminal())
            return []

        const nonTerminalIndex = this.parts.findIndex(p => !p.isTerminal())
        const replacements = this.parts[nonTerminalIndex].children(grammar)
        const children = []
        for (const replacement of replacements) {
            const child = this.clone() as BFSCompositeNode
            child.parts[nonTerminalIndex] = replacement.clone()
            children.push(child)
        }
        return children
    }

    isTerminal() {
        return this.parts.every(p => p.isTerminal())
    }

    clone() {
        const partClones = this.parts.map(p => p.clone())
        return new BFSCompositeNode(this.operator, ...partClones)
    }
    toString() {
        return this.operator.stringify(...this.parts)
    }
    interpret(env: Env) {
        return this.operator.evaluate(this.parts.map(p => p.interpret(env)))
    }
    size() {
        return this.parts.reduce((sum, p) => sum + p.size(), 0)
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
    interpret(env: Env): number {
        throw 'cannot interpret'
    }
    size() {
        return 1
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

    interpret(env: Env): number {
        throw 'cannot interpret'
    }
    size() {
        return 1
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

    interpret(env: Env): number {
        return this.value
    }
    size() {
        return 1
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
    interpret(env: Env): number {
        return env[this.variable]
    }
    size() {
        return 1
    }
}
