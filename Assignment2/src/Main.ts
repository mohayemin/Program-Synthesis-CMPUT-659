import { cacheHitCount } from "./Node"
import { GuidedBUS } from "./GuidedBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ArgumentRule, ConcatProductionRule, ConstantRule, ReplaceProductionRule } from "./ProductionRule"
import { SearchResult } from "./SearchResult"

const ioSet = [
    // { in: '<<AA>>', out: 'AA'},
    { in: '<change> <string> to <a> number', out: 'change string to a number' },
    { in: 'a < 4 and a > 0', out: 'a  4 and a  0' },
    { in: '<open and <close>', out: 'open and close' },
]
const fixedTableGrammar = new ProbGrammar(
    'table',
    ioSet,
    [
        new ReplaceProductionRule(0.188),
        new ConcatProductionRule(0.059)
    ],
    [
        new ConstantRule('', 0.188),
        new ConstantRule('<', 0.188),
        new ConstantRule('>', 0.188),
    ],
    new ArgumentRule(0.188),
    Number.POSITIVE_INFINITY
)

const uniformDistributionGrammar = new ProbGrammar(
    'uniform',
    ioSet,
    [
        new ReplaceProductionRule(1/2),
        new ConcatProductionRule(1/2)
    ],
    [
        new ConstantRule('', 1/4),
        new ConstantRule('<', 1/4),
        new ConstantRule('>', 1/4)
    ],
    new ArgumentRule(1/4),
    50000
)

function printResult(result: SearchResult) {
    console.log(`* Program: ${result.program.toString()}`)
    console.log(`* Size: ${result.program.size()}`)
    console.log(`* Cost: ${result.program.cost.toFixed(0)}`)
    console.log(`* Execution time: ${toKilo(result.executionDurationMs)}s`)
    console.log(`* Programs generated: ${toMillion(result.programsGenerated)}M`)
    console.log(`* Programs evaluated: ${result.programsEvaluated} (${(100 * result.programsEvaluated / result.programsGenerated).toFixed(2)}%)`)
    console.log(`* Cache hit: ${toMillion(cacheHitCount)}M`)
    console.log()

    function toMillion(value: number) {
        return (value / 1e6).toFixed(2)
    }

    function toKilo(value: number) {
        return (value / 1e3).toFixed(2)
    }
}

function run(grammar: ProbGrammar) {
    console.log(`=== ${grammar.name} ===`)
    const probBus = new GuidedBUS(grammar)
    const result = probBus.synthesize()
    printResult(result)
}

//run(fixedTableGrammar)
run(uniformDistributionGrammar)
