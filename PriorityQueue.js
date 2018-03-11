class PriorityQueue {
	constructor() {
		this.data = [];
		this.comparator = (x, y) => {
			return x-y;
		};
	}
	binarySearch(priority) {
		let low, mid, high;
		low = 0;
		high = this.data.length-1;
		while (low <= high) {
			mid = (low + high) >>> 1;
			if (this.comparator(this.data[mid][1], priority) <= 0) {
				low = mid+1;
			} else {
				high = mid-1;
			}
		}
		return low;
	}
	dequeue() {
		if (this.isEmpty()) {
			return "Underflow";
		}
		return this.data.shift();
	}
	enqueue(element, priority) {
		const idx = this.binarySearch(priority);
		this.data.splice(idx, 0, [element, priority]);
	}
	isEmpty() {
		return this.data.length === 0;
	}
}