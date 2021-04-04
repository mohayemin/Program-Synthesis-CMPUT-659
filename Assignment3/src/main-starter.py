import time

from src.DSL import *
from src.match import play_2n_matches, default_yes_no_program
from src.random_player import RandomPlayer
from src.rule_of_28_sketch import Rule_of_28_Player_PS

if __name__ == "__main__":
    # Given by Levi Argmax(Map(Function(Sum(Map(Function(Plus(VarScalarFromArray('move_value'),
    # NumberAdvancedByAction())), None))), VarList('actions')))
    program_decide_column = Argmax(Map(Function(Sum(Map(Function(
        Minus(Times(NumberAdvancedByAction(), VarScalarFromArray('move_value')),
              Times(VarScalar('marker'), IsNewNeutral()))), None))), VarList('actions')))

    p1 = RandomPlayer()
    p2 = Rule_of_28_Player_PS(default_yes_no_program(), program_decide_column)

    start = time.time()

    victories1, victories2 = play_2n_matches(p1, p2, 500)

    end = time.time()
    print(victories1, victories2)
    print('Player 1: ', victories1 / (victories1 + victories2))
    print('Player 2: ', victories2 / (victories1 + victories2))
    print(end - start, ' seconds')
