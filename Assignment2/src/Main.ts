import { GuidedBUS } from "./GuidedBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ArgumentRule, ConcatProductionRule, ConstantRule, ReplaceProductionRule } from "./ProductionRule"
import { SearchResult } from "./SearchResult"
import { ProbeSearch } from "./ProbeSearch"
import { Search } from "./Search"
import { cache } from "./Node"

const ioSet = [
    // { in: '<<AA>>', out: 'AA'},
    { in: '<change> <string> to <a> number', out: 'change string to a number' },
    { in: 'a < 4 and a > 0', out: 'a  4 and a  0' },
    { in: '<open and <close>', out: 'open and close' },
]
const fixedTableGrammar = new ProbGrammar(
    'Fixed distribution table',
    ioSet,
    [
        new ReplaceProductionRule(0.188),
        new ConcatProductionRule(0.059)
    ],
    [
        new ArgumentRule(0.188),
        new ConstantRule('', 0.188),
        new ConstantRule('<', 0.188),
        new ConstantRule('>', 0.188),
    ],
    Number.POSITIVE_INFINITY
)

const uniformDistributionGrammar = new ProbGrammar(
    'Uniform distribution',
    ioSet,
    [
        new ReplaceProductionRule(1/6),
        new ConcatProductionRule(1/6)
    ],
    [
        new ArgumentRule(1/6),
        new ConstantRule('', 1/6),
        new ConstantRule('<', 1/6),
        new ConstantRule('>', 1/6)
    ],
    Number.POSITIVE_INFINITY
)

function printResult(result: SearchResult) {
    console.log(`* Program: ${result.program.toString()}`)
    console.log(`* Size: ${result.program.size()}`)
    console.log(`* Cost: ${result.program.cost.toFixed(0)}`)
    console.log(`* Execution time: ${toKilo(result.executionDurationMs)}s`)
    console.log(`* Programs generated: ${toMillion(result.programsGenerated)}M`)
    console.log(`* Programs evaluated: ${toMillion(result.programsEvaluated)}M (${(100 * result.programsEvaluated / result.programsGenerated).toFixed(2)}%)`)
    console.log(`* Cache hit: ${toMillion(cache.hit)}M (${(cache.hit/(cache.hit + cache.miss)).toFixed(2)}%)`)
    console.log()

    function toMillion(value: number) {
        return (value / 1e6).toFixed(2)
    }

    function toKilo(value: number) {
        return (value / 1e3).toFixed(2)
    }
}

function run(search: Search) {
    cache.hit = 0
    cache.miss = 0
    console.log(`=== ${search.algorithm}: ${search.grammar.name} ===`)
    const result = search.synthesize()
    printResult(result)
}

run(new GuidedBUS(fixedTableGrammar))
//run(new GuidedBUS(uniformDistributionGrammar))
run(new ProbeSearch(uniformDistributionGrammar))

ioSet[0] = { in: 'change> <string> to <a> number', out: 'change string to a number' }
run(new GuidedBUS(fixedTableGrammar))
run(new GuidedBUS(uniformDistributionGrammar))
run(new ProbeSearch(uniformDistributionGrammar))

