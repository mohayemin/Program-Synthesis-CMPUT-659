import { Node } from "./Node";

export interface SearchResult {
    program: Node;
    programsEvaluated: number;
    programsGenerated: number;
    executionDurationMs: number;
}
