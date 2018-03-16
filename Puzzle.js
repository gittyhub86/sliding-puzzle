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
		this.pos = new Map([
			[0, [0, 0]],
			[1, [111, 0]],
			[2, [222, 0]],
			[3, [0, 115]],
			[4, [111, 115]],
			[5, [222, 115]],
			[6, [0, 230]],
			[7, [111, 230]],
			[8, [222, 230]],
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
	constructor() {
		super();
		this.init();
	}
	init() {
		this.cats = ['barns', 'chedda'];
		this.removeHandlers = [];
		this.thumbnails = document.querySelectorAll('.thumbnail');
		this.background = document.querySelectorAll('.background');
		this.mainCat = document.querySelectorAll('.main-cat.hide');
		this.congratulate = document.querySelectorAll('.congratulate.hide');
		this.mainBarns = this.mainCat[0];
		this.mainChedda = this.mainCat[1];
		this.shuffle = document.querySelectorAll('.shuffle');
		this.solve = document.querySelectorAll('.solve');
		this.progressRing = document.querySelector('#progress-ring');
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
		this.solve.forEach((button) => {
			button.addEventListener('click', () => {
				if (this.label && this.label !== this.goal) {
					button.disabled = true;
					this.shuffle.forEach((button) => {
						button.disabled = true;
					});
					const promiseOne = this.promiseInitAnimate();
					promiseOne.then(() => {
						const promiseTwo = this.promiseAnimateSolution();
						promiseTwo.then(() => {
							this.progressRing.classList.add('hide');
							this.shuffle.forEach((button) => {
								button.disabled = false;
							});
							button.disabled = false;
						});
					});
				}
			});
		});
	}
	thumbnailHandler(idx) {
		this.removeTileHandler();
		if (this.tiles) {
			this.tiles.stop(true, true);
		}
		this.cat = this.cats[idx];
		this.hideTiles();
		if (this.cats[idx] === 'barns') {
			this.background[idx].style.backgroundImage = "url(images/" +  "barns.jpg)";
			this.mainBarns.className = "main-cat";
			this.mainChedda.className = "main-cat hide";

			this.congratulate[idx].className = "congratulate hide";
		} else if (this.cats[idx] === 'chedda') {
			this.background[idx].style.backgroundImage = "url(images/" + "chedda.jpg)";
			this.mainBarns.className = "main-cat hide";
			this.mainChedda.className = "main-cat";
			this.congratulate[idx].className = "congratulate hide";
		}
		this.label = null;
	}
	shufflePuzzle() {
		this.removeTileHandler();
		this.removeHandlers = [];
		this.tileSelector();
		$.each(this.tiles, (key, tile) => {
			this.removeHandlers.push(this.listener(tile, 'click', this.moveTileHandler(tile)));
		});
		this.tiles.stop(true, true);
		let tempLabel;
		do {
			tempLabel = buildLabel();
		} while (!this.solvable(tempLabel));
		this.label = tempLabel;
		$.each(this.tiles, (key, tile) => {
			tile.removeAttribute("style");
		});
		for (let i=0, len=this.label.length; i<len; i++) {
			if (this.label[i] === '0') {
				this.spot = i;
			} else {
				const idx = parseInt(this.label[i]) -1;
				this.tiles[idx].className = "container-tile tile pos" + i;
				this.tiles[idx].boardPos = i;
			}
		}
	}
	tileSelector() {
		this.cats.forEach((cat, idx) => {
			if (this.cat === 'barns') {
				this.tiles = $('.background.background-barns .container-tile');
				this.background[idx].style.backgroundImage = "url(images/barns_transparent.jpg)";
				this.congratulate[idx].className = "congratulate hide";
			} else if (this.cat === 'chedda') {
				this.tiles = $('.background.background-chedda .container-tile');
				this.background[idx].style.backgroundImage = "url(images/chedda_transparent.jpg)";
				this.congratulate[idx].className = "congratulate hide";
			}
		});
	}
	hideTiles() {
		if (this.cat === 'barns') {
			this.tiles = $('.background.background-barns .container-tile');
		} else if (this.cat === 'chedda') {
			this.tiles = $('.background.background-chedda .container-tile');
		}
		$.each(this.tiles, (key, tile) => {
			tile.classList.add("hide");
		});
	}
	listener(element, type, handler) {
		element.addEventListener(type, handler);
		return function() {
			element.removeEventListener(type, handler);
		}
	}
	removeTileHandler() {
		this.removeHandlers.forEach(handler => {
			handler();
		});
	}
	moveTileHandler(tile) {
		return () => {
			this.playerMove(tile);
		};
	}
	playerMove(tile) {
		if (this.shifts.get(this.spot).includes(tile.boardPos)) {
			const spot = this.spot;
			this.transition(tile.boardPos);
			tile.className = "tile container-tile animate pos" + this.spot;
			this.spot = tile.boardPos;
			tile.boardPos = spot;
			if (this.label === this.goal) {
				if (this.cat === 'barns') {
					this.congratulate[0].classList.remove('hide');
				}
				else {
					this.congratulate[1].classList.remove('hide');
				}
				this.removeTileHandler();
			}
		}
	}
	transition(to) {
		const blankLocation = this.spot;
		const newBlankLabel = this.label[to];
		let newLabel = '';
		for (let i=0; i<9; i++) {
			if (i == blankLocation) {
				newLabel += newBlankLabel;
			} else if (i == to) {
				newLabel += '0';
			} else {
				newLabel += this.label[i];
			}
		}
		this.label = newLabel;
	}
	solutionAnimation(path) {
		$.each(this.tiles, (key, tile) => {
			tile.classList.remove("animate");
		});
		for (let i=1, len=path.length; i<len; i++) {
			let label = path[i].label;
			for (let j=0, lenLabel=label.length; j <lenLabel; j++) {
				if (label[j] === '0') {
					this.spot = j;
				} else {
					const idx = parseInt(label[j]) - 1;
					$(this.tiles[idx]).animate({"left": this.pos.get(j)[0] + "px"}, "fast")
									  .animate({"top": this.pos.get(j)[1] + "px"}, "fast");
				}
			}
		}
		this.label = this.goal;
	}
	promiseInitAnimate() {
		const promise = new Promise((resolve) => {
			this.progressRing.classList.remove('hide');
			this.removeTileHandler();
			window.setTimeout(() => {
				resolve();
			}, 300);
		});
		return promise;
	}
	promiseAnimateSolution() {
		const promise = new Promise((resolve) => {
						       const result = this.solution();
							   this.solutionAnimation(result);
							   window.setTimeout(() => {
							       resolve();
							   });
						   });
		return promise;
	}
}