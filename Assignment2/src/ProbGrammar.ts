import { Node } from "./Node";
import { ArgumentRule, ConstantRule, FunctionRule } from "./ProductionRule";

export class ProbGrammar {

    constructor(
        public name: string,
        public ioSet: IO[],
        public functions: FunctionRule[],
        public constants: ConstantRule[],
        public argument: ArgumentRule,
        public programPerIterationLimit = Number.POSITIVE_INFINITY,
        public costLimit = 100,
    ) {
    }
}

export interface IO {
    in: string
    out: string
}
