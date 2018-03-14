class Puzzle {
	constructor(order=null) {
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
		if (order) {
			this.label = order;
			for (let i=0; i<order.length; i++) {
				if (order[i] === '0') {
					this.spot = i;
				}
			}
		}

	}
	transitionSolution(to) {
		const label = this.label;
		const blankLocation = this.spot;
		const newBlankLabel = this.label[to];
		//const newBlankLabel = num.toString();
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
	solution() {
		const startTime = new Date().getTime();
		let shortest = null;
		const pq = new PriorityQueue;
		const astar = new Astar;
		let tmpPath, lastNode, newNode, newPath;
		if (this.label) {
			let initPath = [this];
			pq.enqueue(initPath, 1);
			while (!pq.isEmpty()) {
				if (new Date().getTime() - startTime > 3000) {
					break;
				}
				tmpPath = pq.dequeue()[0];
				lastNode = tmpPath[tmpPath.length-1];
				if (lastNode.label === lastNode.goal) {
					if (shortest === null || tmpPath.length < shortest.length) {
						shortest = tmpPath;
						console.log('found shortest: ', shortest);
					}
				}
				if (shortest === null || tmpPath.length+1 < shortest.length) {
					for (let shift of this.shifts.get(lastNode.spot)) {
						newNode = lastNode.transitionSolution(shift);
						if (this.notInPath(newNode, tmpPath)) {
							newPath = tmpPath.concat(newNode);
							let priorty = astar.manhattenDistance(newNode);
							pq.enqueue(newPath, priorty);
						}
					}
				}
			}
			if (shortest === null) {
				return this.solutionFallback(pq, astar);
			} else {
				return shortest;
			}
		}
	}
	solutionFallback(pq, astar) {
		let tmpPath, lastNode, newNode, newPath;
		while (!pq.isEmpty()) {
			tmpPath = pq.dequeue()[0];
			lastNode = tmpPath[tmpPath.length-1];
			if (lastNode.label === lastNode.goal) {
				return tmpPath;
			}
			for (let shift of this.shifts.get(lastNode.spot)) {
				newNode = lastNode.transitionSolution(shift);
				if (this.notInPath(newNode, tmpPath)) {
					newPath = tmpPath.concat(newNode);
					let priority = astar.manhattenDistance(newNode);
					pq.enqueue(newPath, priority);
				}
			}
		}
		return null;
	}
	notInPath(node, path) {
		for (let elt of path) {
			if (node.label === elt.label) {
				return false;
			}
		}
		return true;
	}
	solvable(start) {
		let inversions = 0;
		const startLength = start.length;
		for (let i=0; i<startLength; i++) {
			for (let j=i+1; j<startLength; j++) {
				if (parseInt(start[i]) && parseInt(start[j]) &&
					parseInt(start[i]) > parseInt(start[j])) {
					inversions++;
				}
			}
		}
		if (inversions%2 == 0) {
			return true
		}
		return false;
	}
}

class PuzzleCat extends Puzzle {
	constructor(tiles) {
		super();
		this.init();
	}
	init() {
		this.cats = ['barns', 'chedda'];
		this.thumbnails = document.querySelectorAll('.thumbnail');
		this.background = document.querySelectorAll('.background');
		this.mainCat = document.querySelectorAll('.main-cat.hide');
		this.congratulate = document.querySelectorAll('.congratulate');
		this.mainBarns = this.mainCat[0];
		this.mainChedda = this.mainCat[1];
		this.shuffle = document.querySelectorAll('.shuffle');
		this.handlers()
	}
	handlers() {
		this.thumbnails.forEach((thumbnail, idx) => {
			thumbnail.addEventListener('click', () => {
				this.thumbnailHandler(idx);
			});
		});
		this.shuffle.forEach((button) => {
			button.addEventListener('click', () => {
				this.shufflePuzzle();
			});
		});
	}
	thumbnailHandler(idx) {
		this.cat = this.cats[idx];
		if (this.cats[idx] === 'barns') {
			this.background[idx].style.backgroundImage = "url(images/" +  "barns.jpg)";
			this.mainBarns.className = "main-cat";
			this.mainChedda.className = "main-cat hide";
			this.congratulate[idx].className = "hide";
		} else if (this.cats[idx] === 'chedda') {
			this.background[idx].style.backgroundImage = "url(images/" + "chedda.jpg)";
			this.mainBarns.className = "main-cat hide";
			this.mainChedda.className = "main-cat";
			this.congratulate[idx].className = "hide";
		}
		this.label = null;
	}
	shufflePuzzle() {
		let tempLabel;
		do {
			tempLabel = buildLabel();
		} while (!this.solvable(tempLabel));
		this.label = tempLabel;
		console.log('label: ', this.label);
	}
}

const order = '876543210';
const p = new Puzzle(order);
p.solution();