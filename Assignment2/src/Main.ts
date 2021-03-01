import { Replace, Str } from "./DSLStarter"

let program = new Replace(new Str('a < 4 and a > 0'), new Str('<'), new Str(''))
console.log(program.toString())
console.log(program.interpret({}))