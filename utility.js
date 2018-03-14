function buildLabel() {
	function range(min, max) {
		return Math.floor(Math.random() * (max-min+1)) + min;
	}
	const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	let i = tiles.length-1;
	let label = '';
	while (i >=0) {
		let r = range(0, i);
		label += tiles.splice(r, 1).toString();
		i--;
	}
	return label;
}