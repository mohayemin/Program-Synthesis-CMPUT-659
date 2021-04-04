from src.BUSContext import BUSContext


class BUS:

    def synthesize(
            self,
            search_size,
            operators,
            lists,
            scalars,
            functions,
            programs_evaluated
    ):
        grammar = BUSContext()
        startTime = 0  # performance.now()
        plist = grammar.initial_programs()
        evaluated_count = 0

        for i in range(search_size):
            grammar.grow(plist)
            while evaluated_count < plist.count():
                if self.grammar.isCorrect(plist[evaluated_count]):
                    return {
                        "program": plist[evaluated_count],
                        "programsEvaluated": evaluated_count,
                        "programsGenerated": plist.length,
                        "executionDurationMs": -1 - startTime  # performance.now() - startTime
                    }

                evaluated_count = evaluated_count + 1

        return None
