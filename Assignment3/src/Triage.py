class Triage:
    def __init__(self, level, matches, target_win_percent, is_loggable):
        self.level = level
        self.matches = matches
        self.target_win_percent = target_win_percent
        self.is_loggable = is_loggable

    def __str__(self):
        return f'matches: {self.matches}, goal: {self.target_win_percent}%'


def create_triage_list(match_boundaries, target_win_percents, log_level=2):
    triage_list = []
    total_matches = 0
    for i in range(len(match_boundaries)):
        triage = Triage(i, match_boundaries[i] - total_matches, target_win_percents[i], i >= log_level)
        triage_list.append(triage)
        total_matches += triage.matches

    return triage_list
