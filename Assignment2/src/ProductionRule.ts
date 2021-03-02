import { Argument, Node, Replace, Str } from "./Node";
import { ProbGrammar } from "./ProbGrammar";

export abstract class ProductionRule {
    public cost: number;
    constructor(
        public name: string,
        public probability: number,
        public readonly isGrowable: boolean = false
    ) {
        this.cost = Math.floor(-Math.log2(probability))
    }
}

export abstract class FunctionRule extends ProductionRule {
    abstract grow(programs: Node[], grammar: ProbGrammar): Node[]
}

export class ReplaceProductionRule extends FunctionRule {
    constructor(probability: number) {
        super('replace', probability)
    }
    grow(programs: Node[], grammar: ProbGrammar): Node[] {
        return Array.from(this.generateGrow(programs))
    }

    *generateGrow(programs: Node[]): IterableIterator<Node> {
        for (let iStr = 0; iStr < programs.length; iStr++) {
            for (let iSearch = 0; iSearch < programs.length; iSearch++) {
                if (iStr === iSearch) continue
                for (let iReplace = 0; iReplace < programs.length; iReplace++) {
                    if (iSearch === iReplace) continue

                    yield new Replace(programs[iStr], programs[iSearch], programs[iReplace])
                }
            }
        }
    }
}

export class ConstantRule extends ProductionRule {
    constructor(name: string, probability: number) {
        super(name, probability)
    }

    createNode() {
        return new Str(this.name)
    }
}

export class ArgumentRule extends ProductionRule {
    constructor(probability: number) {
        super('arg', probability)
    }
    createNode() {
        return new Argument()
    }
}
