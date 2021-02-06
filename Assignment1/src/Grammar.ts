import { BooleanOperator, Operator } from "./Operator";
import { Env, Node, NumNode, VarNode } from "./Node";

export class Grammar {
    
    allOperations: Operator[];
    initialPrograms: Node[];
    constructor(
        public name: string,
        public booleanOperations: BooleanOperator[],
        public integerOperations: Operator[],
        public values: number[],
        public variables: string[],
        public inputOutput: Env[]) {
        this.allOperations = this.integerOperations.concat(this.booleanOperations);
        this.initialPrograms = [].concat(values.map(v => new NumNode(v))).concat(variables.map(v => new VarNode(v)));
    }

    isCorrect(program: Node): boolean {
        return this.inputOutput.every(env => program.interpret(env) === env.out)
    }
}
