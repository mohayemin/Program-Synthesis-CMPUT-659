import { Argument, Node, Replace, Str } from "./Node";
import { ProbGrammar } from "./ProbGrammar";
import { SortedProgramList } from "./SortedProgramList";

export abstract class ProductionRule {
    public cost: number;
    constructor(
        public name: string,
        public probability: number,
        public readonly isGrowable: boolean = false
    ) {
        this.cost = -Math.log2(probability)
    }
}

export abstract class FunctionRule extends ProductionRule {
    abstract grow(programs: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>): void
}

export class ReplaceProductionRule extends FunctionRule {
    constructor(probability: number) {
        super('replace', probability)
    }
    grow(programList: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>) {
        const programs = programList.items()
        for (let iStr = 0; iStr < programs.length; iStr++) {
            for (let iSearch = 0; iSearch < programs.length; iSearch++) {
                if (iStr === iSearch) continue
                for (let iReplace = 0; iReplace < programs.length; iReplace++) {
                    if (iSearch === iReplace) continue
                    const program = new Replace(programs[iStr], programs[iSearch], programs[iReplace], this.cost)
                    const out = grammar.ioSet.map(io => program.interpret(io.in))
                    const normalOut = this.normalizeOutput(out)
                    if (!outputCache.has(normalOut)) {
                        outputCache.add(normalOut)
                        programList.push(program)
                    }
                }
            }
        }
    }

    normalizeOutput(out: string[]) {
        return out.join('|')
    }
}

export class ConstantRule extends ProductionRule {
    constructor(name: string, probability: number) {
        super(name, probability)
    }

    createNode() {
        return new Str(this.name, this.cost)
    }
}

export class ArgumentRule extends ProductionRule {
    constructor(probability: number) {
        super('arg', probability)
    }
    createNode() {
        return new Argument(this.cost)
    }
}
