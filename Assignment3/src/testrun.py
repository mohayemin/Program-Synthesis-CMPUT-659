from src.BUS import BUS
from src.GameResults import percent
from src.IBR import IBR
from src.Triage import create_triage_list
from src.match import grand_total_matches
from src.stopwatch import Stopwatch

if __name__ == '__main__':
    bus = BUS(9)

    five_triages = create_triage_list([10, 50, 250, 500, 1000], [20, 35, 45, 55, 55], 3)
    given_triage = create_triage_list([10, 200, 1000], [20, 55, 55], 2)
    simple_triages = create_triage_list([10], [60], 3)
    no_triages = create_triage_list([1000], [55], 10)

    stopwatch = Stopwatch()
    # change the triage below to see the differences
    # use no_triage to run without a triage
    ibr = IBR(stopwatch, bus, given_triage)

    print('start synthesis for the following triages')
    for triage in ibr.triages:
        print(triage)

    stopwatch.start()
    best_responses = ibr.synthesize()
    total_time = stopwatch.elapsed()

    print('\n\n========= Search Complete =========')
    for br in best_responses:
        print()
        print(br)

    print()
    print(f'programs generated     : {bus.total_generated()}')
    print(f'programs processed     : {bus.total_processed()} '
          f'({percent(bus.total_processed(), bus.total_generated()):.2f}%)')
    print(f'matches played         : {grand_total_matches}')
    print(f'Total Time             : {total_time:.2f}s')
    print(f'{bus.total_processed()/total_time} programs per second')
