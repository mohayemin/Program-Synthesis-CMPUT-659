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
    abstract grow(programs: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number): void
}

export class ReplaceProductionRule extends FunctionRule {
    constructor(probability: number) {
        super('replace', probability)
    }
    grow(programList: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number) {
        const programs = programList.items()
        for (let str of programs) {
            const cost0 = this.cost + str.cost
            if (cost0 >= allowedCost)
                break

            for (let search of programs) {
                const cost1 = cost0 + search.cost
                if (cost1 >= allowedCost)
                    break

                for (let replace of programs) {
                    const cost2 = cost1 + replace.cost
                    if (cost2 > allowedCost)
                        break

                    if (search === replace)
                        continue

                    const program = new Replace(str, search, replace, cost2)

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
