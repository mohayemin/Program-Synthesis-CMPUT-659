from src.GameResults import GameResults
from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS
from src.stopwatch import stopwatch


class IBR:
    def __init__(self, program_generator, triages):
        self.program_generator = program_generator
        self.triages = triages
        self.iteration_count = 5

    def synthesize(self) -> list[GameResults]:
        sigma_0 = self.synthesize_sigma_zero()
        best_responses = [sigma_0]

        print(f'found sigma 0: {best_responses[0].me}')

        for i in range(1, self.iteration_count):
            sigma_i = self.find_best_response(best_responses[i - 1].me)
            best_responses.append(sigma_i)
            print(f'found sigma {i}: {sigma_i.me}')

        return best_responses

    def find_best_response(self, opponent_program) -> GameResults:
        # recursion throws StackOverflow, therefore loop
        while self.program_generator.has_next():
            if stopwatch.threshold_crossed():
                print(f'{stopwatch.elapsed():.2f}s passed, '
                      f'{self.program_generator.total_generated()} programs generated, '
                      f'{self.program_generator.total_processed()} programs processed')

            candidate_program = self.program_generator.next()
            result = GameResults(candidate_program, opponent_program, 0, 0, 0, 0)

            for triage in self.triages:
                result = self.play_triage(triage, candidate_program, opponent_program, result)
                if not result.target_passed:
                    break

            if result.target_passed:
                return result

        return None

    def play_triage(self, triage, me, opponent, last_result):
        result = last_result + self.play(me, opponent, triage.matches, triage.target_win_percent)

        def should_print():
            return (triage.print_success and result.target_passed) or (triage.print_fail and not result.target_passed)

        if should_print():
            print(me.toProgramString())
            message = 'PASSED' if result.target_passed else 'FAILED'
            print(f'  :) {message} level {triage.level} of triage with '
                  f'{result.my_wins}/{result.total_matches} ({result.my_win_percent:2.2f}%) wins')

        return result

    def synthesize_sigma_zero(self) -> GameResults:
        while self.program_generator.has_next():
            program = self.program_generator.next()
            sigma0_result = self.play(program, program, 100, 0)
            if sigma0_result.finish_percent >= 60:
                return sigma0_result

        return None

    def play(self, me, opponent, n, target_win_percent):
        my_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(me))
        opponent_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(opponent))

        try:
            v1, v2 = play_2n_matches(my_player, opponent_player, int(n / 2))
            return GameResults(me, opponent, v1, v2, n, target_win_percent)
        except:
            return GameResults(me, opponent, 0, 0, n, target_win_percent)
