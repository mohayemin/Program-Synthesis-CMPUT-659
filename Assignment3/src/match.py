from DSL import *
from game import Game

grand_total_matches = 0


def play_match(p1, p2):
    global grand_total_matches
    grand_total_matches += 1

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


def play_n_matches(p1, p2, n):
    half_n = int(n / 2)
    p1_victories = 0
    p2_victories = 0

    for _ in range(half_n):
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


def play_n_matches_with_early_exit(p1, p2, n, target_win_percent):
    half_n = int(n / 2)
    wins_required_to_exit = int(n * target_win_percent / 100)
    non_wins_required_to_exit = n - wins_required_to_exit

    p1_victories = 0
    p2_victories = 0
    draws = 0

    for i in range(half_n):
        # plays a match with br as player 1
        finished, who_won = play_match(p1, p2)

        if finished:
            if who_won == 1:
                p1_victories += 1
            else:
                p2_victories += 1
        else:
            draws += 1

        # plays another match with br as player 2
        finished, who_won = play_match(p2, p1)

        if finished:
            if who_won == 1:
                p2_victories += 1
            else:
                p1_victories += 1
        else:
            draws += 1

        if p1_victories > wins_required_to_exit:
            break
        if draws + p2_victories > non_wins_required_to_exit:
            break

    return p1_victories, p2_victories, p1_victories + p2_victories + draws


def default_yes_no_program():
    return Sum(Map(Function(Times(Plus(NumberAdvancedThisRound(), Constant(1)), VarScalarFromArray('progress_value'))),
                   VarList('neutrals')))
