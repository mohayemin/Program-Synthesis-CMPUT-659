from src.BUSContext import BUSContext

if __name__ == '__main__':
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
