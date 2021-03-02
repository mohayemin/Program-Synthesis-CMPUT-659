import { Node } from "./Node";
import { ArgumentRule, ConstantRule, FunctionRule } from "./ProductionRule";

export class ProbGrammar {

    constructor(
        public ioSet: IO[],
        public functions: FunctionRule[],
        public constants: ConstantRule[],
        public argument: ArgumentRule
    ) {
    }

    isCorrect(program: Node) {
        return this.ioSet.every(io => program.interpret(io.in) === io.out)
    }
}

export interface IO {
    in: string
    out: string
}
