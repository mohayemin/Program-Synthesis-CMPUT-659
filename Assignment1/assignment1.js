class Node {
    toString() { throw 'Unimplemented method' }
    interpret() { throw 'Unimplemented method' }
    grow(plist, new_plist) { return plist}
}

class Not extends Node {
    constructor(left) {
        this.left = left
    }

    toString() {
        return 'not (' + this.left + ')'
    }

    interpret(env) {
        return !this.left;
    }

    grow(plist, new_plist) { }
}

class And extends Node {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    toString() {
        return "(" + this.left.toString() + " and " + this.right.toString() + ")"
    }

    interpret(env) {
        return this.left.interpret(env) && this.right.interpret(env)
    }

    grow(plist, new_plist) { }
}

class Lt extends Node {
    constructor(left, right) {
        this.left = left
        this.right = right
    }

    toString() {
        return "(" + this.left.toString() + " < " + this.right.toString() + ")"
    }

    interpret(env) {
        return this.left.interpret(env) < this.right.interpret(env)
    }

    grow(plist, new_plist) { }
}

class Ite extends Node {
    constructor(condition, true_case, false_case) {
        this.condition = condition
        this.true_case = true_case
        this.false_case = false_case
    }

    toString() {
        return "(if" + this.condition.toString() + " then " + this.true_case.toString() + " else " + this.false_case.toString() + ")"
    }

    interpret(env) {
        if (this.condition.interpret(env))
            return this.true_case.interpret(env)
        else
            return this.false_case.interpret(env)
    }

    grow(plist, new_plist) { }
}

class Num extends Node {
    constructor(value) {
        this.value = value
    }

    toString() {
        return str(this.value)
    }
    interpret(env) {
        return this.value
    }

    grow(plist, new_plist) { }
}

class Var extends Node {
    constructor(name) {
        this.name = name
    }

    toString() {
        return this.name
    }

    interpret(env) {
        return env[this.name]
    }

    grow(plist, new_plist) { }
}

class Plus extends Node {
    constructor(left, right) {
        this.left = left
        this.right = right
    }

    toString() {
        return "(" + this.left.toString() + " + " + this.right.toString() + ")"
    }

    interpret(env) {
        return this.left.interpret(env) + this.right.interpret(env)
    }

    grow(plist, new_plist) { }
}

class Times extends Node {
    constructor(left, right) {
        this.left = left
        this.right = right
    }

    toString() {
        return "(" + this.left.toString() + " + " + this.right.toString() + ")"
    }

    interpret(env) {
        return this.left.interpret(env) * this.right.interpret(env)
    }

    grow(plist, new_plist) { }
}

class BottomUpSearch {
    grow(plist, integer_operations) { }
    synthesize(bound, integer_operations, integer_values, variables, input_output) { }
}

let synthesizer = new BottomUpSearch()
synthesizer.synthesize(3,
    [Lt, Ite],
    [1, 2],
    ['x', 'y'],
    [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 3 }]
)
synthesizer.synthesize(3, [And, Plus, Times, Lt, Ite, Not], [10], ['x', 'y'], [{ 'x': 5, 'y': 10, 'out': 5 }, { 'x': 10, 'y': 5, 'out': 5 }, { 'x': 4, 'y': 3, 'out': 4 }, { 'x': 3, 'y': 4, 'out': 4 }])
synthesizer.synthesize(3, [And, Plus, Times, Lt, Ite, Not], [-1, 5], ['x', 'y'], [{ 'x': 10, 'y': 7, 'out': 17 },
{ 'x': 4, 'y': 7, 'out': -7 },
{ 'x': 10, 'y': 3, 'out': 13 },
{ 'x': 1, 'y': -7, 'out': -6 },
{ 'x': 1, 'y': 8, 'out': -8 }])
