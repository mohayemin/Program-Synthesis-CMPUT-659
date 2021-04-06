import time


class Stopwatch:
    start_time = -1

    def start(self):
        self.start_time = time.time() - 1e-8  # avoid divide by zero

    def elapsed(self):
        return time.time() - self.start_time

    def elapsed_str(self):
        return f'{self.elapsed():.0f}s'
