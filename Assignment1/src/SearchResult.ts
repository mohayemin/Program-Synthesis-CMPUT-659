import { BFSNode } from "./BreadthFirstSearch";
import { Node } from "./Node";


export interface SearchResult {
    program: Node | BFSNode;
    programsEvaluated: number;
    programsGenerated: number;
    executionDurationMs: number;
}
