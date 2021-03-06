import { performance } from "perf_hooks"
import { GuidedBUS, PartialSolutions } from "./GuidedBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ProductionRule } from "./ProductionRule"
import { SearchResult } from "./SearchResult"

export class ProbeSearch {
    constructor(
        public grammar: ProbGrammar
    ) {
    }

    synthesize(): SearchResult {
        const startTime = performance.now()
        let partialSlutions = new PartialSolutions()

        let count = 0
        while (count < 10) {
            const gs = new GuidedBUS(this.grammar, true, partialSlutions)
            const result = gs.synthesize()
            if (!result.isPartial) {
                result.executionDurationMs = performance.now() - startTime
                return result
            } else {
                this.updateGrammar(result)
                console.log('updated distribution')
            }
        }

        return null
    }

    updateGrammar(result: SearchResult) {
        let totalP = 0
        const rules: ProductionRule[] = [].concat(this.grammar.functions, this.grammar.constants)
        for (const rule of rules) {
            const fValue = result.program.hasRule(rule.name) ? result.program.solvedInputs.length / this.grammar.ioSet.length : 0
            rule['tempP'] = Math.pow(rule.probability, 1 - fValue)
            totalP += rule['tempP']
        }

        for (const func of rules) {
            func.setProbability(func['tempP'] / totalP)
        }

        console.log(rules.map(r => `${r.name},${r.probability.toFixed(2)},${r.cost.toFixed(2)}`))
    }
}

