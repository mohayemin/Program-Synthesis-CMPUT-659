from src.BUS import BUS
from src.IBR import IBR

if __name__ == '__main__':
    bus = BUS(9)
    ibr = IBR(bus)
    sigmaZeroResult = ibr.synthesize()
    # print(sigmaZeroResult.to_string())
    exit(0)

    # count = 0
    # while bus.has_next():
    #     bus.next()
    #     count += 1
    #
    # print(count)