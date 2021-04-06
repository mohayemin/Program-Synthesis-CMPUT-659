from src.match import *


class BUS:
    def __init__(self, max_level):
        self.max_level = max_level
        self.grammar = Grammar()
        self.program_by_size = [[] for _ in range(max_level + 1)]
        self.plist = []
        self.add_programs(self.grammar.initial_programs())
        self._current_level = 1
        self._current_program_index = 0

    def current_level(self):
        return self._current_level

    def total_generated(self):
        return len(self.plist)

    def total_processed(self):
        return self._current_program_index

    def has_next(self):
        if self._current_level < self.max_level:
            return True
        if self._current_program_index < len(self.plist) - 1:
            return True

        return False

    def next(self) -> Node:
        self._current_program_index += 1
        if self._current_program_index == len(self.plist):
            self._current_level += 1
            self.grow(self._current_level)

        return self.plist[self._current_program_index]

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

    def grow(self, depth):
        if depth > self.max_level:
            return

        new_programs = self.grow_map(depth) + \
                       self.grow_list_operators(depth) + \
                       self.grow_binary_operators(depth)
        self.add_programs(new_programs)
        print('Grown to size ' + str(depth) +
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
                if not self.grammar.is_binary_operable(p1):
                    continue

                for p2 in self.program_by_size[allowed_size - p1.size - 1]:
                    if not self.grammar.is_binary_operable(p2):
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


class Grammar:
    can_binary_operated = frozenset(map(lambda op: op.__name__, [
        NumberAdvancedByAction,
        IsNewNeutral,
        NumberAdvancedThisRound,
        ProgressValueVarScalarFromArray,
        MoveValueVarScalarFromArray,
    ]))

    can_list_operated = frozenset(map(lambda op: op.__name__, [
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
            NumberAdvancedThisRound(),
            NumberAdvancedByAction(),
            IsNewNeutral()
        ]

    def is_binary_operable(self, program):
        return type(program).__name__ in self.can_binary_operated

    def is_evaluable(self, program):
        return type(program).__name__ in self.can_list_operated

    def returns_list(self, program):
        return type(program).__name__ in self.can_list_operated
