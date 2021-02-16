import { BottomUpSearch } from "./BottomUpSearch";
import { BreadthFirstSearch } from "./BreadthFirstSearch";
import { Grammar } from "./Grammar";
import { AndOperator, IfThenElseOperator, LessThanOperator, PlusOperator, TimesOperator } from './Operator';
import { SearchResult } from "./SearchResult";

const customGrammar1 = new Grammar(
    "custom 1",
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 0],
    ['x'],
    [
        { 'x': 0, 'y': 10, 'out': 0 },
        { 'x': 10, 'y': 5, 'out': 1 },
        { 'x': 4, 'y': 3, 'out': 1 }
    ]
)

const customGrammar2 = new Grammar(
    "custom 2",
    [],
    [new PlusOperator],
    [1],
    ['x', 'y'],
    [
        { x: 1, y: 0, out: 2 },
        { x: 1, y: 1, out: 3 }
    ]
)

const customGrammar3 = new Grammar(
    "custom 3",
    [],
    [new PlusOperator],
    [],
    ['x', 'y'],
    [
        { x: 0, y: 1, out: 1 },
        { x: 1, y: 2, out: 3 }
    ]
)

const sampleGrammar1 = new Grammar(
    "sample 1",
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 2],
    ['x', 'y'],
    [
        { x: 5,  y: 10, out: 5 },
        { x: 10, y: 5,  out: 5 },
        { x: 4,  y: 3,  out: 3 }
    ]
)

const sampleGrammar2 = new Grammar(
    "sample 2",
    [
        new AndOperator
        , new LessThanOperator
    ],
    [
        new IfThenElseOperator,
        new TimesOperator
    ],
    [10],
    ['x', 'y'],
    [
        { x: 5,  y: 10, out: 5 },
        { x: 10, y: 5,  out: 5 },
        { x: 4,  y: 3,  out: 4 }, 
        { x: 3,  y: 4,  out: 4 }
    ],
    7
)

const sampleGrammar3 = new Grammar(
    "sample 3",
    [new LessThanOperator, new AndOperator],
    [new IfThenElseOperator, new PlusOperator, new TimesOperator],
    [-1],
    ['x', 'y'],
    [
        { x: 10, y: 7, out: 17 },
        { x: 4,  y: 7, out: -7 },
        { x: 10, y: 3, out: 13 },
        { x: 1,  y: -7,out: -6 },
        { x: 1,  y: 8, out: -8 }
    ],
    6
)

function runBUS(grammar: Grammar) {
    console.log(`=== ${grammar.name} ===`)
    console.log(`* Algorithm: BUS`)
    const bus = new BottomUpSearch(3, grammar)
    const result = bus.synthesize()
    printResult(result)
}

function runBFS(grammar: Grammar) {
    console.log(`=== ${grammar.name} ===`)
    console.log(`* Algorithm: BFS`)
    const bfs = new BreadthFirstSearch(grammar)
    const result = bfs.synthesize()
    printResult(result)
}

function printResult(result: SearchResult) {
    console.log(`* Program: ${result.program.toString()}`)
    console.log(`* Execution time: ${result.executionDurationMs}ms`)
    console.log(`* Programs generated: ${result.programsGenerated}`)
    console.log(`* Programs evaluated: ${result.programsEvaluated} (${(100 * result.programsEvaluated / result.programsGenerated).toFixed(2)}%)`)

    console.log()
}

[
    customGrammar1,
    customGrammar2,
    customGrammar3,
    sampleGrammar1,
    sampleGrammar2,
    sampleGrammar3,    
].forEach(grammar => {
    runBUS(grammar)
    runBFS(grammar)
})
