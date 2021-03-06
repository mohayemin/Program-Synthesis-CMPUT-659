import { ProbGrammar } from "./ProbGrammar";
import { SearchResult } from "./SearchResult";


export interface Search {
    synthesize(): SearchResult
    grammar: ProbGrammar
    algorithm: string
}
