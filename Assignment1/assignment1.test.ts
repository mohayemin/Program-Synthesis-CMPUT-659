import { BottomUpSearch } from "./BottomUpSearch";
import { Grammar } from "./Grammar";
import { AndOperator, IfThenElseOperator, LessThanOperator, NotOperator, Operator, PlusOperator, TimesOperator } from './Operator';

const grammar1 = new Grammar(
    [new LessThanOperator],
    [new IfThenElseOperator],
    [1, 2],
    ['x', 'y'],
    [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
)

const grammar2 = new Grammar(
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
// Arthur: (if ((y < 10) and (10 < (y * y))) then y else x)
// Moha: (if((x < 10) and (y < x)) then x else (if(y < 10) then y else x))


const grammer3 = new Grammar(
    [new AndOperator, new LessThanOperator, new NotOperator],
    [new PlusOperator, new TimesOperator, new IfThenElseOperator],
    [10],
    ['x', 'y'],
    [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 4 }, { 'x': 3, 'y': 4, 'out': 4 }]
)

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
    const bus = new BottomUpSearch()
    const out = bus.synthesize(3, grammar)
    console.log("=== Result ===")
    console.log(out.toString())
}

//runBus(grammar1)
runBus(grammar2)


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