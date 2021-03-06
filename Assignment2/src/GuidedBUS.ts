import { performance } from "perf_hooks"
import { Node } from "./Node"
import { IO, ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"
import { SortedProgramList } from "./SortedProgramList"

export class GuidedBUS {
    constructor(
        public grammar: ProbGrammar,
        private findPartial = false,
        private partialSolutions?: PartialSolutions
    ) {
    }

    grow(programList: SortedProgramList, grammer: ProbGrammar, outputCache: Set<string>, cost: number): void {
        for (const func of grammer.functions) {
            func.grow(programList, grammer, outputCache, cost)
        }
    }

    synthesize(): SearchResult {
        const startTime = performance.now()
        let outputCache = new Set<string>()
        let programList = new SortedProgramList()
        programList.push(...this.grammar.constants.map<Node>(r => r.createNode()))
        let programsEvaluated = 0
        let allowedCost = Math.ceil(Math.max(...programList.items().map(n => n.cost)))



        console.log(`cost,#programs`)
        while (allowedCost <= this.grammar.costLimit) {
            while (programsEvaluated < programList.size()) {
                const program = programList.get(programsEvaluated)
                if (program.verify(this.grammar.ioSet)) {
                    console.log(`${allowedCost},${programList.size()}`)
                    return {
                        program,
                        programsEvaluated,
                        programsGenerated: programList.size(),
                        executionDurationMs: performance.now() - startTime,
                        isPartial: false
                    }
                }

                if (this.findPartial && this.partialSolutions.tryAdd(program)) {
                    return {
                        program: program,
                        programsEvaluated,
                        programsGenerated: programList.size(),
                        executionDurationMs: performance.now() - startTime,
                        isPartial: true
                    }
                }

                programsEvaluated++
            }

            console.log(`${allowedCost},${programList.size()}`)
            allowedCost++
            this.grow(programList, this.grammar, outputCache, allowedCost)
        }

        return null
    }
}


export class PartialSolutions {
    private programSet = new Set<string>()
    private solvedInputSet = new Set<string>()
    constructor() {

    }

    tryAdd(program: Node) {
        if (program.solvedInputs.length > 0) {
            const programString = program.toString()
            if (!this.programSet.has(programString)) {
                if (program.solvedInputs.some(input => !this.solvedInputSet.has(input))) {
                    this.programSet.add(programString)
                    program.solvedInputs.forEach(input => this.solvedInputSet.add(input))
                    return true
                }
            }
        }

        return false
    }
}