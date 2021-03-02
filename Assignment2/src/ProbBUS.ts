import { performance } from "perf_hooks"
import { Argument, Node, Str } from "./Node"
import { ProbGrammar } from "./ProbGrammar"
import { SearchResult } from "./SearchResult"

export class ProbBUS {
    public programsGenerated = 0
    public programsEvaluated = 0
    constructor(
        public bound: number,
        public grammar: ProbGrammar
    ) {
    }
    normalizeOutput(out: string[]) {
        return out.join('|')
    }

    grow(plist: Node[], grammer: ProbGrammar, outputCache: Set<string>): void {
        let newPrograms: Node[] = []
        for (const func of grammer.functions) {
            newPrograms = newPrograms.concat(func.grow(plist, grammer))
        }

        for (const program of newPrograms) {
            const out = grammer.ioSet.map(io => program.interpret(io.in))
            const normalOut = this.normalizeOutput(out)
            if (!outputCache.has(normalOut)) {
                outputCache.add(normalOut)
                plist.push(program)
            }
        }
    }

    synthesize(): SearchResult {
        const startTime = performance.now()
        let outputCache = new Set<string>()
        let programList = this.grammar.constants.map<Node>(r => r.createNode())
            .concat([this.grammar.argument.createNode()])

        let evaluatedCount = 0
        for (let i = 0; i < this.bound; i++) {
            this.grow(programList, this.grammar, outputCache)
            for (; evaluatedCount < programList.length; evaluatedCount++) {
                const program = programList[evaluatedCount]
                console.log(program.toString(), '          ',  program.interpret(this.grammar.ioSet[0].in))
                if (this.grammar.isCorrect(program)) {
                    return {
                        program: program,
                        programsEvaluated: evaluatedCount,
                        programsGenerated: programList.length,
                        executionDurationMs: performance.now() - startTime
                    }
                }
            }
        }

        return null
    }
}

