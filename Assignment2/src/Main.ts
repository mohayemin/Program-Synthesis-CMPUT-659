import { Argument, Node, Replace, Str } from "./Node"
import { ProbBUS } from "./ProbBUS"
import { ProbGrammar } from "./ProbGrammar"
import { ArgumentRule, ConstantRule, ReplaceProductionRule } from "./ProductionRule"

// const prog = replace(replace(arg(), str('<'), str('')), str('>'), str(''))
// console.log(prog.toString())
// console.log(prog.interpret('a < 4 and a > 0'))

function replace(str: Node, search: Node, replace: Node): Replace {
    return new Replace(str, search, replace)
}

function str(val: string) {
    return new Str(val)
}

function arg() {
    return new Argument()
}

const simplifiedGrammar = new ProbGrammar(
    [
        { in: 'a < 4 and a > 0', out: 'a  4 and a  0' }
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