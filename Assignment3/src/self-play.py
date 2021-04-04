def converged():
    return False


def self_play(dsl, game, solver):
    p1 = dsl.random()
    while converged(p1):
        p2 = solver.bestResponse(game, p1)
        p1 = solver.bestResponse(game, p2)

    return p1


#  if U=J(pi) > J(pi-i), accept pi with probability 1
# otherwise accept according to the temperature

