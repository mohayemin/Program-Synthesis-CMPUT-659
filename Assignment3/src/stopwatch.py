import time


class Stopwatch:
    start_time = -1
    _interval = 30
    _next_threshold = 60

    def start(self):
        self.start_time = time.time()

    def elapsed(self):
        return time.time() - self.start_time

    def threshold_crossed(self):
        if self.elapsed() >= self._next_threshold:
            self._next_threshold += self._interval
            return True
        return False


stopwatch = Stopwatch()
stopwatch.start()
