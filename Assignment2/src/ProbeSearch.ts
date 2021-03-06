import { performance } from "perf_hooks"
import { GuidedBUS } from "./GuidedBUS"
import { PartialSolutions } from "./PartialSolutions"
import { ProbGrammar } from "./ProbGrammar"
import { ProductionRule } from "./ProductionRule"
import { SearchResult } from "./SearchResult"

export class ProbeSearch {
    algorithm = "Probe"
    constructor(
        public grammar: ProbGrammar
    ) {
    }

    synthesize(): SearchResult {
        const startTime = performance.now()
        let partialSlutions = new PartialSolutions()

        let finalResult: SearchResult = {
            executionDurationMs: 0,
            isPartial: false,
            program: null,
            programsEvaluated: 0,
            programsGenerated: 0
        }

        let count = 0
        while (count < 10) {
            const gs = new GuidedBUS(this.grammar, true, partialSlutions)
            const result = gs.synthesize()
            if (!result.isPartial) {
                this.updateFinalResult(result, finalResult)
                finalResult.executionDurationMs = performance.now() - startTime
                return result
            } else {
                this.update(result, finalResult)
                console.log('updated distribution')
            }
        }

        return null
    }

    updateFinalResult(partialResult: SearchResult, finalResult: SearchResult) {
        finalResult.programsEvaluated += partialResult.programsEvaluated
        finalResult.programsGenerated += partialResult.programsGenerated
    }

    update(partialResult: SearchResult, finalResult: SearchResult) {
        let totalP = 0
        const rules: ProductionRule[] = [].concat(this.grammar.functions, this.grammar.constants)
        for (const rule of rules) {
            const fValue = partialResult.program.hasRule(rule.name) ? partialResult.program.solvedInputs.length / this.grammar.ioSet.length : 0
            rule['tempP'] = Math.pow(rule.probability, 1 - fValue)
            totalP += rule['tempP']
        }

        for (const func of rules) {
            func.setProbability(func['tempP'] / totalP)
        }

        this.updateFinalResult(partialResult, finalResult)
        console.log(rules.map(r => `${r.name},${r.probability.toFixed(2)},${r.cost.toFixed(2)}`))
    }
}

