import { BottomUpSearch } from "./BottomUpSearch";
import { BFSCompositeNode, BFSNumberSymbolNode, BFSValueNode, BFSVariableNode, BreadthFirstSearch } from "./BreadthFirstSearch";
import { Grammar } from "./Grammar";
import { VarNode } from "./Node";
import { AndOperator, IfThenElseOperator, LessThanOperator, NotOperator, Operator, PlusOperator, TimesOperator } from './Operator';

const grammarSimple = new Grammar(
    "gs",
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 0],
    ['x'],
    [
        { 'x': 0, 'y': 10, 'out': 0 },
        { 'x': 10, 'y': 5, 'out': 1 },
        { 'x': 4, 'y': 3, 'out': 1 }
    ]
) // 1<x?1:0

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

const grammar2 = new Grammar(
    "grammar 2",
    [new AndOperator, new LessThanOperator, new NotOperator],
    [new PlusOperator, new TimesOperator, new IfThenElseOperator],
    [10],
    ['x', 'y'],
    [
        { 'x': 5, 'y': 10, 'out': 5 },
        { 'x': 10, 'y': 5, 'out': 5 },
        { 'x': 4, 'y': 3, 'out': 4 }, { 'x': 3, 'y': 4, 'out': 4 }
    ]
)
// Arthur: (if ((y < 10) and (10 < (y * y))) then y else x)
// Moha: (if((x < 10) and (y < x)) then x else (if(y < 10) then y else x))

const grammar3 = new Grammar(
    "grammar 3",
    [new AndOperator, new LessThanOperator, new NotOperator],
    [new PlusOperator, new TimesOperator, new IfThenElseOperator],
    [-1, 5],
    ['x', 'y'],
    [
        { 'x': 10, 'y': 7, 'out': 17 },
        { 'x': 4, 'y': 7, 'out': -7 },
        { 'x': 10, 'y': 3, 'out': 13 },
        { 'x': 1, 'y': -7, 'out': -6 },
        { 'x': 1, 'y': 8, 'out': -8 }
    ]
)
// Arthur:    (if (x < y) then (y * -1) else (y + x))
// Mohayemin: (if((y < x) and (y < x)) then (x + y) else (-1 * y))

function testGrow(operator: Operator, grammer: Grammar) {
    console.log(operator.constructor.name)
    var newPrograms = operator.grow(grammer.initialPrograms, grammer)

    let count = 0;
    const io = grammer.inputOutput[0]
    for (const p of newPrograms) {
        console.log(++count, p.toString(), io, p.interpret(io), io.out)
    }
}

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

function testChildren() {
    const numSym = new BFSCompositeNode(grammar1.booleanOperations[0], new BFSVariableNode('x'), new BFSNumberSymbolNode())
    console.log(numSym.toString())
    const children = numSym.children(grammar1)
    for (const child of children) {
        console.log(`  ${child.toString()}`)
    }
}

// testChildren()


function runBFS(grammar: Grammar) {
    const bfs = new BreadthFirstSearch(grammar)
    const program = bfs.synthesize()
    console.log(program.toString())
}

//runBFS(grammarSimple)
runBFS(grammar1)
runBFS(grammar2)
runBFS(grammar3)
