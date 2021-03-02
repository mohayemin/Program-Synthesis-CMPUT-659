import { Argument, cacheHitCount, Node, Replace, Str } from "./Node"
import { ProbBUS } from "./ProbBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ArgumentRule, ConstantRule, ReplaceProductionRule } from "./ProductionRule"

const simplifiedGrammar = new ProbGrammar(
    [
        { in: 'a < 4 and a > 0', out: 'a  4 and a  0' },
        //{ in: '<open and <close>', out: 'open and close'}
    ],
    [
        new ReplaceProductionRule(0.188)
    ],
    [
        new ConstantRule('', 0.188),
        new ConstantRule('<', 0.188),
        new ConstantRule('>', 0.188),
    ],
    new ArgumentRule(0.188)
)

const probBus = new ProbBUS(3, simplifiedGrammar)
const results = probBus.synthesize()
console.log(results.program.toString())
console.log(cacheHitCount)

