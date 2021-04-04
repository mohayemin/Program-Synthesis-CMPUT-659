from src.BUSContext import BUSContext
from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


class BUS:
    def synthesize(
            self,
            search_size,
    ):
        context = BUSContext()
        startTime = 0  # performance.now()

        evaluated_count = 0

        for i in range(search_size):
            context.grow(i)
            while evaluated_count < len(context.plist):
                sigma_result = self.is_reasonable_signa_0(context.plist[evaluated_count])
                if sigma_result.is_reasonable:
                    return {
                        "sigmaResults": sigma_result,
                        "programsEvaluated": evaluated_count,
                        "programsGenerated": len(context.plist),
                        "executionDurationMs": -1 - startTime  # performance.now() - startTime
                    }

                evaluated_count = evaluated_count + 1

        return None

    def is_reasonable_signa_0(self, program):
        argmaxed = Argmax(program)
        player = Rule_of_28_Player_PS(default_yes_no_program(), argmaxed)
        try:
            victories1, victories2 = play_2n_matches(player, player, 50)
            return Sigma0Results(argmaxed, victories1, victories2)
        except Exception:
            return Sigma0Results(argmaxed, 0, 0)


class Sigma0Results:
    def __init__(self, program, victories1, victories2):
        self.program = program
        self.total_victory = victories1 + victories2
        self.is_reasonable = self.total_victory >= 60
        self.victories1 = victories1
        self.victories2 = victories2
        self.win_percent = self.total_victory / 100
