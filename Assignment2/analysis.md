Optimizations
1. Cache program evaluations
2. Early exit loops in node.grow functions
3. Increase cost by one in each step

**Fixed distribution table**
* Program: replace(replace(replace(replace(replace(replace(arg,'<',''),'<',''),'<',''),'>',''),'>',''),'>','')
* Cost: 46
* Execution time: 66.41s
* Programs generated: 2.39M
* Programs evaluated: 2392790 (99.94%)
* Cache hit: 321.04M

**Uniform distribution (without concat)**
* Program: replace(replace(replace(replace(replace(replace(arg,'<',''),'>',''),'>',''),'<',''),'<',''),'>','')
* Size: 19
* Cost: 49
* Execution time: 39.77s
* Programs generated: 2.39M
* Programs evaluated: 525544 (21.95%)
* Cache hit: 188.36M

In uniform distribution, concat rearly generates duplicate.
This is why when concat has same probability as replace,
too many programs are generated