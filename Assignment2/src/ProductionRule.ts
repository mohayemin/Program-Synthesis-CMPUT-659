import { Argument, Concat, Node, Replace, Str } from "./Node";
import { ProbGrammar } from "./ProbGrammar";
import { SortedProgramList } from "./SortedProgramList";

export let oversized = 0

function normalizeOutput(out: string[]) {
    return out.join('|')
}
export abstract class ProductionRule {
    public cost: number;
    public probability: number;
    constructor(
        public name: string,
        probability: number,
        public readonly isGrowable: boolean = false
    ) {
        this.setProbability(probability)
    }

    setProbability(probability: number) {
        this.probability = probability
        this.cost = -Math.log2(probability)
    }
}

export abstract class FunctionRule extends ProductionRule {
    abstract grow(programs: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number): void
}

export class ReplaceProductionRule extends FunctionRule {
    constructor(probability: number) {
        super(Replace.name, probability)
    }
    grow(programList: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number) {
        const oldPrograms = programList.items()
        let newProgramCount = 0
        for (let str of oldPrograms) {
            const cost0 = this.cost + str.cost
            if (cost0 >= allowedCost)
                break

            for (let search of oldPrograms) {
                const cost1 = cost0 + search.cost
                if (cost1 >= allowedCost)
                    break

                for (let replace of oldPrograms) {
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
                        newProgramCount++
                        programList.push(program)
                        if (newProgramCount >= grammar.programPerIterationLimit)
                            return
                    }
                }
            }
        }
    }
}

export class ConcatProductionRule extends FunctionRule {
    constructor(probability: number) {
        super(Concat.name, probability)
    }

    grow(programList: SortedProgramList, grammar: ProbGrammar, outputCache: Set<string>, allowedCost: number): void {
        const programs = programList.items()
        let newProgramCount = 0
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
                    newProgramCount++
                    programList.push(program)
                    if (newProgramCount >= grammar.programPerIterationLimit)
                        return
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
        super(Argument.name, probability)
    }
    createNode() {
        return new Argument(this.cost)
    }
}
