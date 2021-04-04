from src.BUS import BUS
from src.IBS import IBS

if __name__ == '__main__':
    bus = BUS(9)
    ibs = IBS(bus)
    sigmaZeroResult = ibs.synthesize_sigma_zero()
    print(sigmaZeroResult.to_string())
    exit(0)

