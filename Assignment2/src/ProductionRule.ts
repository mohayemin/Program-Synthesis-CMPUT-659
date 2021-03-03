import { Argument, Concat, Replace, Str } from "./Node";
import { ProbGrammar } from "./ProbGrammar";
import { SortedProgramList } from "./SortedProgramList";

function normalizeOutput(out: string[]) {
    return out.join('|')
}
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
                    const normalOut = normalizeOutput(out)
                    if (!outputCache.has(normalOut)) {
                        outputCache.add(normalOut)
                        programList.push(program)
                    }
                }
            }
        }
    }
}

export class ConcatProductionRule extends FunctionRule {
    constructor(probability: number) {
        super('concat', probability)
    }
    
    grow(programList: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number): void {
        const programs = programList.items()
        for (let x of programs) {
            const cost0 = this.cost + x.cost
            if (cost0 >= allowedCost)
                break

            for (let y of programs) {
                const cost1 = cost0 + y.cost
                if (cost1 >= allowedCost)
                    break

                const program = new Concat(x, y, cost1)

                const out = grammar.ioSet.map(io => program.interpret(io.in))
                const normalOut = normalizeOutput(out)
                if (!outputCache.has(normalOut)) {
                    outputCache.add(normalOut)
                    programList.push(program)
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
