# Assignment 1
* Course: Program Synthesis in XAI
* Submitted by: Mohayeminul (Mohayemin) Islam

## How to run
You will need Node.js to run the code. The prebuilt code is available in `build/assignment1.js`. Run the following command to run the code:
```
node build/assignment1.js
```

The original typescript source code is available in `src` folder.

## Report
I have only implemented Bottom-up search (BUS) so far.

### Test Case 1
* BUS
  * Program: (if(x < y) then x else y)
  * Execution time: 1ms
  * Programs generated: 23
  * Programs evaluated: 18 (78.26%)

### Test Case 2
* BUS
  * Program: (if((x < 10) and (y < x)) then x else (if(y < 10) then y else x))
  * Execution time: 310ms
  * Programs generated: 2128
  * Programs evaluated: 381 (17.90%)

### Test Case 3
* BUS
  * Program: (if((y < x) and (y < x)) then (x + y) else (-1 * y))
  * Execution time: 4348ms
  * Programs generated: 10357
  * Programs evaluated: 4295 (41.47%)

I did not use the size constraint as suggested in the assignment description.
This can be a reason why my syntasized programs are larger than expected.