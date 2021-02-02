import { IfElseNode, LessThanNode, NumNode } from './Node'
import { Grammar } from "./Grammar";
import { AndOperator, IfThenElseOperator, LessThanOperator } from './Operator';
const ite = new IfElseNode(new LessThanNode(new NumNode(4), new NumNode(5)), new NumNode(6), new NumNode(20))


const grammar = new Grammar(
    [new AndOperator, new LessThanOperator],
    [new IfThenElseOperator],
    [],
    ['x', 'y'],
    [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
)
var newPrograms = ite.grow(grammar.initialPrograms, grammar)

let count = 0;
for (const p of newPrograms) {
    console.log(++count, p.toString(), p.interpret(grammar.inputOutput[0]))
}


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