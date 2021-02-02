import { Operator } from "./Operator";
import { Node, NumNode, VarNode } from "./Node";




export class Grammar {
    allOperations: Operator[];
    initialPrograms: Node[];
    constructor(
        public booleanOperations: Operator[],
        public integerOperations: Operator[],
        public values: number[],
        public variables: string[],
        public inputOutput: any[]) {
        this.allOperations = this.booleanOperations.concat(this.integerOperations);
        this.initialPrograms = [].concat(values.map(v => new NumNode(v))).concat(variables.map(v => new VarNode(v)));
    }
}
