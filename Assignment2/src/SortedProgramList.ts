// This code was borrowed from https://stackoverflow.com/a/42919752/887149

import { Node } from "./Node"

const top = 0
const parent = (i: number) => ((i + 1) >>> 1) - 1
const left = (i: number) => (i << 1) + 1
const right = (i: number) => (i + 1) << 1
const comparator = (a: Node, b: Node) => a.cost < b.cost


export class SortedProgramList {
    private _heap: Node[] = []

    constructor() {
        this._heap = []
    }
    items() {
        return this._heap.slice(0) // send a copy
    }
    size() {
        return this._heap.length
    }
    isEmpty() {
        return this.size() == 0
    }
    peek() {
        return this._heap[top]
    }
    push(...values: Node[]) {
        values.forEach(value => {
            this._heap.push(value)
            this._siftUp()
        })
        return this.size()
    }
    pop() {
        const poppedValue = this.peek()
        const bottom = this.size() - 1
        if (bottom > top) {
            this._swap(top, bottom)
        }
        this._heap.pop()
        this._siftDown()
        return poppedValue
    }
    replace(value: Node) {
        const replacedValue = this.peek()
        this._heap[top] = value
        this._siftDown()
        return replacedValue
    }
    get(index: number) {
        return this._heap[index]
    }
    private _greater(i: number, j: number) {
        return comparator(this._heap[i], this._heap[j])
    }
    private _swap(i: number, j: number) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]]
    }
    private _siftUp() {
        let index = this.size() - 1
        while (index > top && this._greater(index, parent(index))) {
            this._swap(index, parent(index))
            index = parent(index)
        }
    }
    private _siftDown() {
        let index = top
        while (
            (left(index) < this.size() && this._greater(left(index), index)) ||
            (right(index) < this.size() && this._greater(right(index), index))
        ) {
            let maxChild = (right(index) < this.size() && this._greater(right(index), left(index))) ? right(index) : left(index)
            this._swap(index, maxChild)
            index = maxChild
        }
    }
}