import { Argument, cacheHitCount, Node, Replace, Str } from "./Node"
import { ProbBUS } from "./ProbBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ArgumentRule, ConcatProductionRule, ConstantRule, ReplaceProductionRule } from "./ProductionRule"
import { SearchResult } from "./SearchResult"

const simplifiedGrammar = new ProbGrammar(
    [
        { in: '<change> <string> to <a> number', out: 'change string to a number' },
        { in: '<<AA>>', out: 'AA'},
        { in: 'a < 4 and a > 0', out: 'a  4 and a  0' },
        { in: '<open and <close>', out: 'open and close' },
    ],
    [
        new ReplaceProductionRule(0.188),
        new ConcatProductionRule(0.059)
    ],
    [
        new ConstantRule('', 0.188),
        new ConstantRule('<', 0.188),
        new ConstantRule('>', 0.188),
    ],
    new ArgumentRule(0.188)
)

function printResult(result: SearchResult) {
    console.log(`* Program: ${result.program.toString()}`)
    console.log(`* Cost: ${result.program.cost}`)
    console.log(`* Execution time: ${result.executionDurationMs}ms`)
    console.log(`* Programs generated: ${result.programsGenerated}`)
    console.log(`* Programs evaluated: ${result.programsEvaluated} (${(100 * result.programsEvaluated / result.programsGenerated).toFixed(2)}%)`)
    console.log(`* Cache hit: ${cacheHitCount}`)
    console.log()
}

const probBus = new ProbBUS(50, simplifiedGrammar)
const result = probBus.synthesize()

printResult(result)

