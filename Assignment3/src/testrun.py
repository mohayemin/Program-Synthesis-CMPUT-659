from src.BUSContext import BUSContext

if __name__ == '__main__':
    grammar = BUSContext()
    n = 9
    for i in range(1, n + 1):
        grammar.grow(i)

    for p in grammar.plist:
        print(p.toString() + ' , ' + str(p.size))
    print(len(grammar.plist))
