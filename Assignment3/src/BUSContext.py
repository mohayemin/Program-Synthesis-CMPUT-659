from src.DSL import *


class BUSContext:

    def __init__(self):
        self.program_by_size = [[] for _ in range(10)]
        self.plist = []
        self.add_programs(BUSContext.initial_programs())

        self.scalar_returners = frozenset(map(lambda op: op.__name__, [
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
        self.list_returners = frozenset(map(lambda op: op.__name__, [
            Map,
            ActionsVarList,
            NeutralsVarList,
        ]))
        # Function,Constant,

        self.binary_operators = [Times, Plus, Minus]
        self.list_operators = [Sum]

    def add_programs(self, programs):
        for p in programs:
            self.program_by_size[p.size].append(p)
            self.plist.append(p)

    def returns_scalar(self, program):
        return type(program).__name__ in self.scalar_returners

    def returns_list(self, program):
        return type(program).__name__ in self.list_returners

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
        for list_operator in self.list_operators:  # just sum really
            for p in self.program_by_size[allowed_size - 1]:
                if not self.returns_list(p):
                    continue
                new_programs.append(list_operator(p))
        return new_programs

    def grow_binary_operators(self, allowed_size) -> list[Node]:
        new_programs = []
        for binary_operator in self.binary_operators:
            for p1 in self.plist:
                if p1.size + 1 == allowed_size:
                    break
                if not self.returns_scalar(p1):
                    continue

                for p2 in self.program_by_size[allowed_size - p1.size - 1]:
                    if not self.returns_scalar(p2):
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
                if not self.returns_list(lst):
                    continue
                p = Map(Function(exp), lst)
                new_programs.append(p)

        return new_programs
