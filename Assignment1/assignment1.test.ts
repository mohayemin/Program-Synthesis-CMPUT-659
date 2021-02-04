import { runInThisContext } from "vm";
import { Grammar } from "./Grammar";
import { IfThenElseOperator, LessThanOperator, Operator } from './Operator';

const grammar1 = new Grammar(
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 2],
    ['x', 'y'],
    [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
)

function runTest(operator: Operator, grammer: Grammar) {
    console.log(operator.constructor.name)
    var newPrograms = operator.grow(grammer.initialPrograms, grammar1)

    let count = 0;
    for (const p of newPrograms) {
        console.log(++count, p.toString(), grammer.inputOutput[0], p.interpret(grammar1.inputOutput[0]))
    }
}

runTest(grammar1.integerOperations[0], grammar1)
runTest(grammar1.booleanOperations[0], grammar1)

// let synthesizer = new BottomUpSearch()
// synthesizer.synthesize(3, new Grammar(
//     [Lt],
//     [Ite],
//     [1, 2],
//     ['x', 'y'],
//     [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
// ))
// synthesizer.synthesize(3, [And, Lt, Not], [Plus, Times, Ite], [10], ['x', 'y'], [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 4 }, { 'x': 3, 'y': 4, 'out': 4 }])
// synthesizer.synthesize(3, [And, Lt, Not], [Plus, Times, Ite], [-1, 5], ['x', 'y'], [{ 'x': 10, 'y': 7, 'out': 17 },
// { 'x': 4, 'y': 7, 'out': -7 },
// { 'x': 10, 'y': 3, 'out': 13 },
// { 'x': 1, 'y': -7, 'out': -6 },
// { 'x': 1, 'y': 8, 'out': -8 }])