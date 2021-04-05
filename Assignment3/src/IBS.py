from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


class IBS:
    def __init__(self, program_generator):
        self.program_generator = program_generator
        self.max_iterations = 5

    def synthesize(self):
        best_responses = [None] * (self.max_iterations + 1)
        best_responses[0] = self.synthesize_sigma_zero()

        for i in range(1, self.max_iterations + 1):
            best_responses[i] = self.find_best_response(best_responses[i - 1])
            best_responses[i + 1] = self.find_best_response(best_responses[i])
            pass

    def find_best_response(self, opponent):
        candidate_br = self.program_generator.next()

        return opponent

    def synthesize_sigma_zero(self):
        p_count = 0
        while self.program_generator.has_next():
            program = self.program_generator.next()
            p_count += 1
            sigma0_result = self.self_play(program)
            if sigma0_result.completion_percent >= 60:
                sigma0_result.programs_evaluated = p_count
                sigma0_result.programs_generated = self.program_generator.total_programs()
                sigma0_result.execution_time_sec = -1  # time.time() - start_time
                return sigma0_result

        return None

    def self_play(self, program):
        argmax = Argmax(program)
        player = Rule_of_28_Player_PS(default_yes_no_program(), argmax)
        try:
            victories1, victories2 = play_2n_matches(player, player, 50)
            return SigmaResults(argmax, victories1, victories2)
        except Exception:
            return SigmaResults(argmax, 0, 0)


class SigmaResults:
    programs_evaluated = -1
    programs_generated = -1
    execution_time_sec = -1

    def __init__(self, program, victories1, victories2, total_matches):
        self.program = program
        self.total_victory = victories1 + victories2
        self.victories1 = victories1
        self.victories2 = victories2
        self.completion_percent = 100 * self.total_victory / total_matches

    def to_string(self):
        return f'program: {self.program.toProgramString()}\n' \
               f'completion percent: {self.completion_percent}%\n' \
               f'execution time: {self.execution_time_sec:.2f}s'
