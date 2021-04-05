class Triage:
    def __init__(self, level, matches, target_win_percent, print_success, print_fail):
        self.level = level
        self.matches = matches
        self.target_win_percent = target_win_percent
        self.print_success = print_success
        self.print_fail = print_fail

    def __str__(self):
        return f'matches: {self.matches}, goal: {self.target_win_percent}%'


def create_triage_list(match_boundaries, target_win_percents, start_print_success=0, start_print_error=1):
    triage_list = []
    total_matches = 0
    for i in range(len(match_boundaries)):
        triage = Triage(i, match_boundaries[i] - total_matches, target_win_percents[i], i >= start_print_success,
                        i >= start_print_error)
        triage_list.append(triage)
        total_matches += triage.matches

    return triage_list
