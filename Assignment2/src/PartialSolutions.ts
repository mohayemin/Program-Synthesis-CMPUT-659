import { Node } from "./Node";

export class PartialSolutions {
    private programSet = new Set<string>();
    private solvedInputSet = new Set<string>();
    constructor() {
    }

    tryAdd(program: Node) {
        if (program.solvedInputs.length > 0) {
            const programString = program.toString();
            if (!this.programSet.has(programString)) {
                if (program.solvedInputs.some(input => !this.solvedInputSet.has(input))) {
                    this.programSet.add(programString);
                    program.solvedInputs.forEach(input => this.solvedInputSet.add(input));
                    return true;
                }
            }
        }

        return false;
    }
}
