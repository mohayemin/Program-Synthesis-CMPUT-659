import copy

class Node:   
    def getSize(self):
        return self.size
    
    def toString(self):
        raise Exception('Unimplemented method: toString')
    
    def interpret(self):
        raise Exception('Unimplemented method: interpret')
    
class Str(Node):
    def __init__(self, value):
        self.value = value   
        
    def toString(self):
        return self.value
    
    def interpret(self, env):
        return self.value
    
class Var(Node):
    def __init__(self, name):
        self.value = name
        
    def toString(self):
        return self.value
    
    def interpret(self, env):
        return copy.deepcopy(env[self.value])

class Concat(Node):
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
    def toString(self):
        return 'concat(' + self.x.toString() + ", " + self.y.toString() + ")"
    
    def interpret(self, env):
        return self.x.interpret(env) + self.y.interpret(env) 


class Replace(Node):
    def __init__(self, input_str, old, new):
        self.str = input_str
        self.old = old
        self.new = new
        
    def toString(self):
        return self.str.toString() + '.replace(' + self.old.toString() + ", " + self.new.toString() + ")"
    
    def interpret(self, env):
        return self.str.interpret(env).replace(self.old.interpret(env), self.new.interpret(env), 1)
    
program = Replace(Str('a < 4 and a > 0'), Str('<'), Str(''))
print(program.interpret(None))