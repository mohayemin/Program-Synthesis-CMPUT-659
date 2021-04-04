from src.BUS import BUS

if __name__ == '__main__':
    bus = BUS()
    sigmaZeroResult = bus.synthesize_sigma_zero(9)
    print(sigmaZeroResult.to_string())
    exit(0)

