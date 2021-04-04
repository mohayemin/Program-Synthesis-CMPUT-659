from DSL import *
from game import Game


def play_match(p1, p2):
    game = Game(n_players=2, dice_number=4, dice_value=6, column_range=[2, 12],
                offset=2, initial_height=3)

    is_over = False
    who_won = None

    number_of_moves = 0
    current_player = game.player_turn
    while not is_over:
        moves = game.available_moves()
        if game.is_player_busted(moves):
            if current_player == 1:
                current_player = 2
            else:
                current_player = 1
            continue
        else:
            if game.player_turn == 1:
                chosen_play = p1.get_action(game)
            else:
                chosen_play = p2.get_action(game)
            if chosen_play == 'n':
                if current_player == 1:
                    current_player = 2
                else:
                    current_player = 1
            game.play(chosen_play)
            number_of_moves += 1
        who_won, is_over = game.is_finished()

        if is_over:
            return is_over, who_won

        if number_of_moves >= 300:
            return False, None


def play_2n_matches(p1, p2, n):
    p1_victories = 0
    p2_victories = 0

    for _ in range(n):
        # plays a match with br as player 1
        finished, who_won = play_match(p1, p2)

        if finished:
            if who_won == 1:
                p1_victories += 1
            else:
                p2_victories += 1

        # plays another match with br as player 2
        finished, who_won = play_match(p2, p1)

        if finished:
            if who_won == 1:
                p2_victories += 1
            else:
                p1_victories += 1

    return p1_victories, p2_victories


def default_yes_no_program():
    return Sum(Map(Function(Times(Plus(NumberAdvancedThisRound(), Constant(1)), VarScalarFromArray('progress_value'))),
                   VarList('neutrals')))

