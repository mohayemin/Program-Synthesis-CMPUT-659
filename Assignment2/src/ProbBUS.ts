import { performance } from "perf_hooks"
import { Argument, Node, Str } from "./Node"
import { ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"
import { SortedProgramList } from "./SortedProgramList"

export class ProbBUS {
    public programsGenerated = 0
    public programsEvaluated = 0
    constructor(
        public bound: number,
        public grammar: ProbGrammar
    ) {
    }

    grow(programList: SortedProgramList, grammer: ProbGrammar, outputCache: Set<string>): void {
        for (const func of grammer.functions) {
            func.grow(programList, grammer, outputCache)
        }
    }

    synthesize(): SearchResult {
        const startTime = performance.now()
        let outputCache = new Set<string>()
        let programList = new SortedProgramList()
        programList.push(this.grammar.argument.createNode(), ...this.grammar.constants.map<Node>(r => r.createNode()))
        let evaluatedCount = 0

        for (let i = 0; i < this.bound; i++) {
            this.grow(programList, this.grammar, outputCache)

            while (evaluatedCount < programList.size()) {
                const program = programList.get(evaluatedCount)
                console.log(evaluatedCount, programList.size(), outputCache.size, program.toString(), '  ', program.interpret(this.grammar.ioSet[0].in), program.cost.toFixed(0))

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
        }

        return null
    }
}

