import { Grammar } from "./Grammar"
import { Node } from "./Node"

export class BottomUpSearch {
    constructor(
        public bound: number, 
        public grammar: Grammar
    ) {
    }
    normalizeOutput(out: number[]) {
        return out.join('|')
    }

    grow(plist: Node[], grammer: Grammar, outputCache: Set<string>): void {
        let newPrograms: Node[] = []
        for (const op of grammer.allOperations) {
            newPrograms = newPrograms.concat(op.grow(plist, grammer))
        }

        for (const program of newPrograms) {
            const out = grammer.inputOutput.map(io => program.interpret(io))
            const normalOut = this.normalizeOutput(out)
            if(!outputCache.has(normalOut)){
                outputCache.add(normalOut)
                plist.push(program)
            }
        }
    }

    synthesize(): Node {
        let outputCache = new Set<string>()
        let plist = this.grammar.initialPrograms.concat()
        let evaluatedCount = 0
        for (let i = 0; i < this.bound; i++) {
            this.grow(plist, this.grammar, outputCache)
            for (; evaluatedCount < plist.length; evaluatedCount++) {
                if (this.grammar.isCorrect(plist[evaluatedCount])) {
                    return plist[evaluatedCount]
                }
            }
        }

        return null
    }
}
