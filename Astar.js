class Astar {
	constructor() {
		this.tileCoord = new Map([
			[0, [0, 0]],
			[1, [0, 1]],
			[2, [0, 2]],
			[3, [1, 0]],
			[4, [1, 1]],
			[5, [1, 2]],
			[6, [2, 0]],
			[7, [2, 1]],
			[8, [2, 2]],
		]);
	}
	manhattenDistance(node) {
		const label = node.label;
		const goal = '123456780';
		let currTile;
		let goalPos;
		let result = 0;
		for (let i=0, labelLen=label.length; i<labelLen; i++) {
			currTile = label[i];
			if (currTile === '0') {
				continue;
			} else {
				goalPos = parseInt(currTile) - 1;
			}
			result += Math.abs(this.tileCoord.get(i)[0] - this.tileCoord.get(goalPos)[0]) +
					  Math.abs(this.tileCoord.get(i)[1] - this.tileCoord.get(goalPos)[1]);
		}
		return result;
	}
}