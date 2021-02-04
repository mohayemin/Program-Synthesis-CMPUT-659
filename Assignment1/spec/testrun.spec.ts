import { BottomUpSearch } from "../BottomUpSearch"
import { Grammar } from "../Grammar"
import { IfThenElseOperator, LessThanOperator } from "../Operator"

describe("test run", () => {
    function runBus(grammar: Grammar) {
        const bus = new BottomUpSearch()
        const out = bus.synthesize(3, grammar)
        return out
    }
    
    it("grammer 1", () => {
        const grammar1 = new Grammar(
            [new LessThanOperator],
            [new IfThenElseOperator],
            [1, 2],
            ['x', 'y'],
            [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
        )

        runBus(grammar1)
    })
})