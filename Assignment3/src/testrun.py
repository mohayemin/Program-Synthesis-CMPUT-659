from src.BUS import BUS
from src.IBR import IBR
from src.Triage import create_triage_list
from src.stopwatch import stopwatch

if __name__ == '__main__':
    bus = BUS(9)

    five_triages = create_triage_list([10, 50, 250, 500, 1000], [20, 35, 45, 55, 55], 10, 3)
    given_triage = create_triage_list([10, 200, 1000], [20, 55, 55], 10, 2)
    simple_triages = create_triage_list([10], [20], 3, 3)

    ibr = IBR(bus, five_triages)
    best_responses = ibr.synthesize()

    print('\n\n========= Search Complete =========')
    for br in best_responses:
        print()
        print(br)

    print()
    print(f'Total Time {stopwatch.elapsed():.2f}s')

    # count = 0
    # while bus.has_next():
    #     bus.next()
    #     count += 1
    #
    # print(count)
