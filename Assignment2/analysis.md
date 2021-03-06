Optimizations
1. Cache program evaluations
2. Early exit loops in node.grow functions
3. Increase cost by one in each step

## Short Program
* Program: replace(replace(replace(replace(replace(arg,'<',''),'<',''),'>',''),'>',''),'>','')
* Program size: 16

**Fixed distribution table**
* Cost: 39
* Execution time: 5.20s
* Programs generated: 0.19M
* Programs evaluated: 0.19 (99.83%)
* Cache hit: 24.84M

**Uniform distribution (Plain)**
* Cost: 41
* Execution time: 33.34s
* Programs generated: 1.16M
* Programs evaluated: 0.87 (75.57%)
* Cache hit: 189.47M

**Uniform distribution (Probe)**
* Cost: 38
* Execution time: 2.81s
* Programs generated: 0.19M
* Programs evaluated: 0.19M (99.64%)
* Cache hit: 39.02M

## Original Program
* Program: replace(replace(replace(replace(replace(replace(arg,'<',''),'<',''),'<',''),'>',''),'>',''),'>','')
* Size: 19 
 
**Fixed distribution table**
* Cost: 46
* Execution time: 72.07s
* Programs generated: 2.39M
* Programs evaluated: 2.39M (99.94%)
* Cache hit: 325.83M

**Uniform distribution (Plain)**  
Runs out of memory before finding result

**Uniform distribution (Probe)**
* Cost: 45
* Execution time: 55.28s
* Programs generated: 2.39M
* Programs evaluated: 2.39M (99.92%)
* Cache hit: 536.95M