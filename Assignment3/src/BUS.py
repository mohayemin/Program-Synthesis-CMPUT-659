import time

from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS


class BUS:
    def __init__(self):
        self.grammar = Grammar()
        self.program_by_size = [[] for _ in range(10)]
        self.plist = []
        self.add_programs(self.grammar.initial_programs())
        _next_index = 0
        pass

    def next(self):

        pass

    def synthesize_sigma_zero(self, search_size):
        start_time = time.time()

        for i in range(1, search_size):
            for program in self.program_by_size[i]:
                sigma0_result = self.is_reasonable_signa_0(program)
                print(sigma0_result.program.toProgramString(), sigma0_result.win_percent)
                if sigma0_result.is_reasonable:
                    sigma0_result.programs_generated = len(self.plist)
                    sigma0_result.execution_time_sec = time.time() - start_time
                    return sigma0_result

            self.grow(i + 1)

        return None

    @staticmethod
    def is_reasonable_signa_0(program):
        argmax = Argmax(program)
        player = Rule_of_28_Player_PS(default_yes_no_program(), argmax)
        try:
            victories1, victories2 = play_2n_matches(player, player, 50)
            return Sigma0Results(argmax, victories1, victories2)
        except Exception:
            return Sigma0Results(argmax, 0, 0)

    def add_programs(self, programs):
        for p in programs:
            self.program_by_size[p.size].append(p)
            self.plist.append(p)

    @staticmethod
    def initial_programs() -> list[Node]:
        return [
            ActionsVarList(),
            NeutralsVarList(),
            ProgressValueVarScalarFromArray(),
            MoveValueVarScalarFromArray(),
            # MarkerVarScalar(),
            NumberAdvancedThisRound(),
            NumberAdvancedByAction(),
            IsNewNeutral()
        ]

    def grow(self, allowed_size):
        new_programs = self.grow_binary_operators(allowed_size) + \
                       self.grow_list_operators(allowed_size) + \
                       self.grow_map(allowed_size)
        self.add_programs(new_programs)
        print('size ' + str(allowed_size) +
              ', new ' + str(len(new_programs)) +
              ', total ' + str(len(self.plist)))

    def grow_list_operators(self, allowed_size) -> list[Node]:
        new_programs = []
        for list_operator in self.grammar.list_operators:  # just sum really
            for p in self.program_by_size[allowed_size - 1]:
                if not self.grammar.returns_list(p):
                    continue
                new_programs.append(list_operator(p))
        return new_programs

    def grow_binary_operators(self, allowed_size) -> list[Node]:
        new_programs = []
        for binary_operator in self.grammar.binary_operators:
            for p1 in self.plist:
                if p1.size + 1 == allowed_size:
                    break
                if not self.grammar.returns_scalar(p1):
                    continue

                for p2 in self.program_by_size[allowed_size - p1.size - 1]:
                    if not self.grammar.returns_scalar(p2):
                        continue
                    new_programs.append(binary_operator(p1, p2))
        return new_programs

    def grow_map(self, allowed_size) -> list[Node]:
        new_programs = []
        # with empty list
        for exp in self.program_by_size[allowed_size - 2]:  # 1 for Func node + 1 for exp
            new_programs.append(Map(Function(exp), None))

        for exp in self.plist:
            if exp.size + 1 == allowed_size:
                break
            for lst in self.program_by_size[allowed_size - exp.size - 2]:
                if not self.grammar.returns_list(lst):
                    continue
                p = Map(Function(exp), lst)
                new_programs.append(p)

        return new_programs


class Sigma0Results:
    programs_generated = -1
    execution_time_sec = -1

    def __init__(self, program, victories1, victories2):
        self.program = program
        self.total_victory = victories1 + victories2
        self.is_reasonable = self.total_victory >= 60
        self.victories1 = victories1
        self.victories2 = victories2
        self.win_percent = self.total_victory / 100

    def to_string(self):
        return f'program: {self.program.toProgramString()}\n' \
               f'win percent: {self.win_percent}%\n' \
               f'programs evaluated: {self.programs_generated}\n' \
               f'execution time: {self.execution_time_sec:.2f}s'


class Grammar:
    scalar_returners = frozenset(map(lambda op: op.__name__, [
        Times,
        Plus,
        Minus,
        Argmax,
        Sum,
        NumberAdvancedByAction,
        IsNewNeutral,
        NumberAdvancedThisRound,
        ProgressValueVarScalarFromArray,
        MoveValueVarScalarFromArray,
        MarkerVarScalar,
    ]))

    list_returners = frozenset(map(lambda op: op.__name__, [
        Map,
        ActionsVarList,
        NeutralsVarList,
    ]))

    binary_operators = [Times, Plus, Minus]
    list_operators = [Sum]

    def initial_programs(self) -> list[Node]:
        return [
            ActionsVarList(),
            NeutralsVarList(),
            ProgressValueVarScalarFromArray(),
            MoveValueVarScalarFromArray(),
            # MarkerVarScalar(),
            NumberAdvancedThisRound(),
            NumberAdvancedByAction(),
            IsNewNeutral()
        ]

    def returns_scalar(self, program):
        return type(program).__name__ in self.scalar_returners

    def returns_list(self, program):
        return type(program).__name__ in self.list_returners
