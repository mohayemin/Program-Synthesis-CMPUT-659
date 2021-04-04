from src.BUS import BUS
from src.IBS import IBS

if __name__ == '__main__':
    bus = BUS(9)
    ibs = IBS(bus)
    sigmaZeroResult = ibs.synthesize_sigma_zero()
    print(sigmaZeroResult.to_string())
    exit(0)

    # count = 0
    # while bus.has_next():
    #     bus.next()
    #     count += 1
    #
    # print(count)