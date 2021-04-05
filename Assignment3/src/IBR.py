from src.GameResults import GameResults
from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


def percent(num, of):
    return of if of == 0 else 100 * num / of


class IBR:
    def __init__(self, program_generator):
        self.program_generator = program_generator
        self.max_iterations = 5

    def synthesize(self):
        best_responses = [None] * (self.max_iterations + 1)
        best_responses[0] = self.synthesize_sigma_zero()

        print('found sigma zero')
        print(best_responses[0])
        print()

        for i in range(1, self.max_iterations + 1):
            best_responses[i] = self.find_best_response(best_responses[i - 1].me)
            print(f'found sigma {i}')
            print(best_responses[i])

    def find_best_response(self, opponent_program) -> GameResults:
        # recursion throws StackOverflow, therefore loop
        while True:
            candidate_program = self.program_generator.next()
            result = self.play(candidate_program, opponent_program, 10)
            if self.print_and_check_triage(result, 20, 1):
                result += self.play(candidate_program, opponent_program, 190)
                if self.print_and_check_triage(result, 55, 2):
                    result += self.play(candidate_program, opponent_program, 800)
                    if self.print_and_check_triage(result, 55, 3) >= 55:
                        break

        return result

    @staticmethod
    def print_and_check_triage(results, pass_threshold_percent, level):
        is_pass = results.my_win_percent >= pass_threshold_percent

        if level == 1:
            if is_pass:
                print('\n', results.me.toProgramString())
                print(
                    f'  :) PASSED level {level} of triage with {results.my_wins} ({results.my_win_percent:2.2f}%) wins')
        else:
            print(f'  :( FAILED level {level} of triage with {results.my_wins} ({results.my_win_percent:2.2f}%) wins')

        return is_pass

    def synthesize_sigma_zero(self) -> GameResults:
        while self.program_generator.has_next():
            program = self.program_generator.next()
            sigma0_result = self.play(program, program, 100)
            if sigma0_result.finish_percent >= 60:
                return sigma0_result

        return None

    def play(self, me, opponent, n):
        my_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(me))
        opponent_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(opponent))

        try:
            v1, v2 = play_2n_matches(my_player, opponent_player, int(n / 2))
            return GameResults(me, opponent, v1, v2, n)
        except:
            return GameResults(me, opponent, 0, 0, n)


