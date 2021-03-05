import { performance } from "perf_hooks"
import { Node } from "./Node"
import { ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"
import { SortedProgramList } from "./SortedProgramList"

export class ProbeSearch {
    public programsGenerated = 0
    public programsEvaluated = 0
    constructor(
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
        let allowedCost = Math.ceil(Math.max(...programList.items().map(n => n.cost)))

        console.log(`cost,#programs`)
        while (allowedCost <= this.grammar.costLimit) {
            while (evaluatedCount < programList.size()) {
                const program = programList.get(evaluatedCount)
                //console.log('    ', program.toString(), '  ', program.interpret(this.grammar.ioSet[0].in))

                if (program.verify(this.grammar.ioSet)) {
                    console.log(`${allowedCost},${programList.size()}`)
                    return {
                        program: program,
                        programsEvaluated: evaluatedCount,
                        programsGenerated: programList.size(),
                        executionDurationMs: performance.now() - startTime
                    }
                }
                if(program.solvedIO.length > 0) {

                }
                evaluatedCount++
            }

            console.log(`${allowedCost},${programList.size()}`)
            allowedCost++
            this.grow(programList, this.grammar, outputCache, allowedCost)
        }

        return null
    }
}

