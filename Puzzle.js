class Puzzle {
	constructor(order) {
		this.label = order;
		this.goal = '123456780';
		this.shifts = new Map([
				[0, [1, 3]],
				[1, [0, 2, 4]],
				[2, [1, 5]],
				[3, [0, 4, 6]],
				[4, [1, 3, 5, 7]],
				[5, [2, 4, 8]],
				[6, [3, 7]],
				[7, [4, 6, 8]],
				[8, [5, 7]],
			]);
		for (let i=0; i<order.length; i++) {
			if (order[i] === '0') {
				this.spot = i;
			}
		}

	}
	transition(to) {
		const label = this.label;
		const blankLocation = this.spot;
		const num = this.label[to];
		const newBlankLabel = num.toString();
		let newLabel = '';
		for (let i=0; i<9; i++) {
			if (i === blankLocation) {
				newLabel += newBlankLabel;
			} else if (i === to) {
				newLabel += '0';
			} else {
				newLabel += label[i];
			}
		}
		return new Puzzle(newLabel);
	}
}

const order = '125638047';
const p = new Puzzle(order);

const newPuzzle = p.transition(3);
console.log(newPuzzle.label);