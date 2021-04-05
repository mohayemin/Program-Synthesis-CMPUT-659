from src.BUS import BUS
from src.IBR import IBR
from src.stopwatch import stopwatch

if __name__ == '__main__':
    bus = BUS(9)
    ibr = IBR(bus)
    sigmaZeroResult = ibr.synthesize()
    # print(sigmaZeroResult.to_string())

    print(f'completed in {stopwatch.elapsed():.2f}s')

    # count = 0
    # while bus.has_next():
    #     bus.next()
    #     count += 1
    #
    # print(count)