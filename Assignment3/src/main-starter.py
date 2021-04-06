import time

from src.DSL import *
from src.match import *
from src.rule_of_28_sketch import Rule_of_28_Player_PS

if __name__ == "__main__":
    sigma1 = Argmax(Map(Function(Sum(Map(Function(VarScalarFromArray('move_value')), None))), VarList('actions')))
    sigmax = Argmax(
        Map(Function(Times(NumberAdvancedByAction(), Sum(Map(Function(VarScalarFromArray('move_value')), None)))),
            VarList('actions')))

    levi = Argmax(
        Map(Function(Sum(Map(Function(Plus(VarScalarFromArray('move_value'), NumberAdvancedByAction())), None))),
            VarList('actions')))

    the_boss = Argmax(Map(Function(Sum(Map(Function(
        Minus(Times(NumberAdvancedByAction(), VarScalarFromArray('move_value')),
              Times(VarScalar('marker'), IsNewNeutral()))), None))), VarList('actions')))

    p1 = Rule_of_28_Player_PS(default_yes_no_program(), sigma1)
    p2 = Rule_of_28_Player_PS(default_yes_no_program(), sigmax)

    start = time.time()

    victories1, victories2 = play_n_matches(p1, p2, 1000)

    end = time.time()
    print(victories1, victories2, 1000 - victories1 - victories2)
    print('Player 1: ', victories1 / (victories1 + victories2))
    print('Player 2: ', victories2 / (victories1 + victories2))
    print(end - start, ' seconds')
