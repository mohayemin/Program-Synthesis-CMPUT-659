from src.BUS import BUS
from src.BUSContext import BUSContext

if __name__ == '__main__':
    bus = BUS()
    result = bus.synthesize(9)
    sigmaResult = result['sigmaResults']
    program = sigmaResult.program
    print(program.toProgramString(), program.size, sigmaResult.win_percent)
    exit(0)

    grammar = BUSContext()
    n = 9
    for i in range(1, n + 1):
        grammar.grow(i)

    for p in grammar.program_by_size[9]:
        p_str = p.toProgramString()
        # if not p_str.startswith('Map(Function(Sum(Map'):
        #     continue

        print(p_str + ' , ' + str(p.size))
    print(len(grammar.plist))
