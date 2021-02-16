import { BottomUpSearch } from "./BottomUpSearch";
import { BreadthFirstSearch } from "./BreadthFirstSearch";
import { Grammar } from "./Grammar";
import { IfThenElseOperator, LessThanOperator } from './Operator';



const grammar1 = new Grammar(
    "grammar 1",
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 2],
    ['x', 'y'],
    [
        { 'x': 5, 'y': 10, 'out': 5 },
        { 'x': 10, 'y': 5, 'out': 5 },
        { 'x': 4, 'y': 3, 'out': 3 }
    ]
)

// Arthur:  (if ((y < 10) and (10 < (y * y))) then y else x)
// Moha: (if((x < 10) and (y < x)) then x else (if(y < 10) then y else x))

// Arthur:    (if (x < y) then (y * -1) else (y + x))
// Mohayemin: (if((y < x) and (y < x)) then (x + y) else (-1 * y))


// testGrow(grammar1.integerOperations[0], grammar1)
// testGrow(grammar1.booleanOperations[0], grammar1)
// testGrow(grammar2.integerOperations[0], grammar2)

function runBus(grammar: Grammar) {
    console.log(`=== ${grammar.name} ===`)
    const bus = new BottomUpSearch(3, grammar)
    const result = bus.synthesize()
    console.log(`* Program: ${result.program.toString()}`)
    console.log(`* Execution time: ${result.executionDurationMs}ms`)
    console.log(`* Programs generated: ${result.programsGenerated}`)
    console.log(`* Programs evaluated: ${result.programsEvaluated} (${(100 * result.programsEvaluated / result.programsGenerated).toFixed(2)}%)`)

    console.log()
}

//runBus(grammar1)
//runBus(grammar2)
//runBus(grammar3)





// testFirstChild(grammar2.integerOperations[0].createDefaultBFSNode(), grammar2)

function runBFS(grammar: Grammar) {
    const bfs = new BreadthFirstSearch(grammar)
    const program = bfs.synthesize()
    console.log('found it: ' + program.toString())
}

// runBFS(grammarSimple2)
//runBFS(grammarSimple)
runBus(grammar1)
runBFS(grammar1)
// runBFS(grammar2) // 1.4.1.2.2.1.2.1.5.2.2.2
// runBFS(grammar3)

// runBus(grammar2)