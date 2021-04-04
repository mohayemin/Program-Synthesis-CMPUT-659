from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


class IBS:
    def __init__(self, program_generator):
        self.program_generator = program_generator
        self.max_iterations = 5

    def synthesize_sigma_zero(self):
        p_count = 0
        while self.program_generator.has_next():
            program = self.program_generator.next()
            p_count += 1
            sigma0_result = self.is_reasonable_sigma_0(program)
            if sigma0_result.is_reasonable:
                sigma0_result.programs_evaluated = p_count
                sigma0_result.programs_generated = self.program_generator.total_programs()
                sigma0_result.execution_time_sec = -1  # time.time() - start_time
                return sigma0_result

        return None

    def is_reasonable_sigma_0(self, program):
        argmax = Argmax(program)
        player = Rule_of_28_Player_PS(default_yes_no_program(), argmax)
        try:
            victories1, victories2 = play_2n_matches(player, player, 50)
            return Sigma0Results(argmax, victories1, victories2)
        except Exception:
            return Sigma0Results(argmax, 0, 0)


class Sigma0Results:
    programs_evaluated = -1
    programs_generated = -1
    execution_time_sec = -1

    def __init__(self, program, victories1, victories2):
        self.program = program
        self.total_victory = victories1 + victories2
        self.is_reasonable = self.total_victory >= 60
        self.victories1 = victories1
        self.victories2 = victories2
        self.win_percent = self.total_victory

    def to_string(self):
        return f'program: {self.program.toProgramString()}\n' \
               f'win percent: {self.win_percent}%\n' \
               f'programs generated: {self.programs_generated}\n' \
               f'programs evaluated: {self.programs_evaluated}\n' \
               f'execution time: {self.execution_time_sec:.2f}s'
