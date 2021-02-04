import { BooleanOperator, Operator } from "./Operator";
import { Node, NumNode, VarNode } from "./Node";




export class Grammar {
    allOperations: Operator[];
    initialPrograms: Node[];
    constructor(
        public booleanOperations: BooleanOperator[],
        public integerOperations: Operator[],
        public values: number[],
        public variables: string[],
        public inputOutput: any[]) {
        this.allOperations = this.integerOperations.concat(this.booleanOperations);
        this.initialPrograms = [].concat(values.map(v => new NumNode(v))).concat(variables.map(v => new VarNode(v)));
    }
}
