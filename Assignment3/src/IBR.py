from src.GameResults import GameResults, percent
from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


class IBR:
    def __init__(self, stopwatch, program_generator, triages):
        self.stopwatch = stopwatch
        self.program_generator = program_generator
        self.triages = triages

    def synthesize(self) -> list[GameResults]:
        sigma_0 = self.synthesize_sigma_zero()
        best_responses = [sigma_0]

        print(f'found sigma 0: {best_responses[0].me} in {self.stopwatch.elapsed():.0f}s')

        i = 0
        while self.program_generator.has_next():
            i += 1
            sigma_i = self.find_best_response(best_responses[i - 1].me)
            best_responses.append(sigma_i)
            print(f'found sigma {i}: {sigma_i.me} in {self.stopwatch.elapsed():.0f}s')

        return best_responses

    def print_update(self):
        if self.stopwatch.threshold_crossed():
            processed = self.program_generator.total_processed()
            generated = self.program_generator.total_generated()
            level = self.program_generator.current_level()
            elapsed = self.stopwatch.elapsed()
            print(f'Time: {elapsed:.0f}s, '
                  f'processed {processed}/{generated} ({percent(processed, generated):.0f}%), '
                  f'BUS level {level}, '
                  f'{processed / elapsed:.2f} programs per second')

    def find_best_response(self, opponent_program) -> GameResults:
        # recursion throws StackOverflow, therefore loop
        while self.program_generator.has_next():
            self.print_update()
            # print(self.program_generator.total_processed(), self.stopwatch.elapsed())
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

        if triage.is_loggable:
            print(me.toProgramString())
            message = ':) PASSED' if result.target_passed else ':( FAILED'
            print(f'  {message} level {triage.level} of triage with '
                  f'{result.my_wins}/{result.total_matches} ({result.my_win_percent:2.2f}%) wins')

        return result

    def synthesize_sigma_zero(self) -> GameResults:
        while self.program_generator.has_next():
            program = self.program_generator.next()
            player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(program))
            try:
                v1, v2 = play_n_matches(player, player, 100)
            except:
                continue

            sigma0_result = GameResults(program, program, v1, v2, 100, 0)
            if sigma0_result.finish_percent >= 60:
                return sigma0_result

        return None

    def play(self, me, opponent, n, target_win_percent):
        my_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(me))
        opponent_player = Rule_of_28_Player_PS(default_yes_no_program(), Argmax(opponent))

        try:
            v1, v2, total = play_n_matches_with_early_exit(my_player, opponent_player, n, target_win_percent)
            return GameResults(me, opponent, v1, v2, total, target_win_percent)
        except:
            return GameResults(me, opponent, 0, 0, n, target_win_percent)
