import { performance } from "perf_hooks"
import { Node } from "./Node"
import { PartialSolutions } from "./PartialSolutions"
import { IO, ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"
import { SortedProgramList } from "./SortedProgramList"

export class GuidedBUS {
    algorithm = "Guided BUS"
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

        while (allowedCost <= this.grammar.costLimit) {
            while (programsEvaluated < programList.size()) {
                const program = programList.get(programsEvaluated)
                if (program.verify(this.grammar.ioSet)) {
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

            allowedCost++
            this.grow(programList, this.grammar, outputCache, allowedCost)
        }

        return null
    }
}

