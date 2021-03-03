import { performance } from "perf_hooks"
import { Argument, Node, Str } from "./Node"
import { ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"
import { SortedProgramList } from "./SortedProgramList"

export class ProbBUS {
    public programsGenerated = 0
    public programsEvaluated = 0
    constructor(
        public maxAllowedCost: number,
        public grammar: ProbGrammar
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
        programList.push(this.grammar.argument.createNode(), ...this.grammar.constants.map<Node>(r => r.createNode()))
        let evaluatedCount = 0
        let allowedCost = Math.round(Math.max(...programList.items().map(n => n.cost)))

        while (allowedCost <= this.maxAllowedCost) {
            console.log(`evaluating cost ${allowedCost} programs`)

            while (evaluatedCount < programList.size()) {
                const program = programList.get(evaluatedCount)
                //console.log('    ', program.toString(), '  ', program.interpret(this.grammar.ioSet[0].in))

                if (this.grammar.isCorrect(program)) {
                    return {
                        program: program,
                        programsEvaluated: evaluatedCount,
                        programsGenerated: programList.size(),
                        executionDurationMs: performance.now() - startTime
                    }
                }
                evaluatedCount++
            }

            console.log(`analyzed total ${programList.size()} programs without success. Moving to next cost.`)
            allowedCost++
            this.grow(programList, this.grammar, outputCache, allowedCost)
        }

        return null
    }
}

