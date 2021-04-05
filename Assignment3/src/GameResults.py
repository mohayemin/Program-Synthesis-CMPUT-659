from src.IBR import percent


class GameResults:
    def __init__(self, me, opponent, my_wins, opponent_wins, total_matches):
        self.me = me
        self.opponent = opponent
        self.my_wins = my_wins
        self.opponent_wins = opponent_wins
        self.total_matches = total_matches
        self.total_victory = my_wins + opponent_wins
        self.finish_percent = percent(self.total_victory, total_matches)
        self.my_win_percent = percent(my_wins, total_matches)
        self.my_win_percent_in_finished_games = percent(my_wins, my_wins + opponent_wins)
        self.is_same_player = me == opponent

    def __str__(self):
        if self.is_same_player:
            return f'me (self played): {self.me.toProgramString()}\n' \
                   f'completion percent: {self.finish_percent:2.2f}%'
        else:
            return f'me: {self.me.toProgramString()}\n' \
                   f'opponent: {self.opponent.toProgramString()}\n' \
                   f'completion percent: {self.finish_percent:2.2f}%'

    def __add__(self, other):
        if (self.me != other.me) or (self.opponent != other.opponent):
            raise AttributeError()

        return GameResults(self.me,
                           self.opponent,
                           self.my_wins + other.my_wins,
                           self.opponent_wins + other.opponent_wins,
                           self.total_matches + other.total_matches
                           )