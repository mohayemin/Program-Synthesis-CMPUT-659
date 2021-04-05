import time


class Stopwatch:
    start_time = -1
    _interval = 30
    _next_threshold = 1

    def start(self, interval=30, first_threshold=1):
        self.start_time = time.time()
        self._interval = interval
        self._next_threshold = 1

    def elapsed(self):
        return time.time() - self.start_time

    def threshold_crossed(self):
        if self.elapsed() >= self._next_threshold:
            self._next_threshold = self.elapsed() + self._interval
            return True
        return False
