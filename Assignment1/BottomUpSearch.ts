import { Grammar } from "./Grammar"
import { Node } from "./Node"

export class BottomUpSearch {
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

    synthesize(bound: number, grammar: Grammar): Node {
        let outputCache = new Set<string>()
        let plist = grammar.initialPrograms.concat()
        let evaluatedCount = 0
        for (let i = 0; i < bound; i++) {
            this.grow(plist, grammar, outputCache)
            for (; evaluatedCount < plist.length; evaluatedCount++) {
                if (grammar.isCorrect(plist[evaluatedCount])) {
                    return plist[evaluatedCount]
                }
            }
        }

        return null
    }
}
