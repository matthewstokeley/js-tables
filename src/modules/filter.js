(function(tableModules) {

	/**
	 * [Filter description]
	 * @param {[type]} options [description]
	 * @todo  pagination
	 */
	var Filter = function(options) {
		this.input = options.input;
		this.table = options.table;
		this.rows = options.tableRows;
		this.pagination = options.pagination;
		this.listen();
	};

	/**
	 * [listen description]
	 * @return {[type]} [description]
	 */
	Filter.prototype.listen = function() {
		this.input.addEventListener('keyup', this.find.bind(this));
	};

	/**
	 * [getValue description]
	 * @return {[type]} [description]
	 */
	Filter.prototype.getValue = function() {
		return this.input.value;
	};

	/**
	 * [find description]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	Filter.prototype.find = function() {
		Array.prototype.forEach.call(this.rows, this.search.bind(this));
	};

	/**
	 * [loopCells description]
	 * @param  {[type]} cells [description]
	 * @return {[type]}       [description]
	 */
	Filter.prototype.loopCells = function(cells) {
		return Array.prototype.map.call(cells, this.isRowFound.bind(this));
	};

	/**
	 * [getColumns description]
	 * @return {[type]} [description]
	 */
	Filter.prototype.search = function(row) {
		return this.doesArrayContainTrue(this.loopCells(row.getElementsByTagName('td'))) === false ? this.hideRow(row) : this.showRow(row);
	};

	/**
	 * [getCellValue description]
	 * @param  {[type]} column [description]
	 * @return {[type]}        [description]
	 */
	Filter.prototype.getCellValue = function(column) {
		return column.getElementsByTagName('span')[0].dataset.value;
	};

	/**
	 * [isRowFound description]
	 * @param  {[type]}  column [description]
	 * @param  {[type]}  row    [description]
	 * @return {Boolean}        [description]
	 */
	Filter.prototype.isRowFound = function(column, row) {
		return this.getCellValue(column).indexOf(this.getValue()) !== -1 ? true : false;
	};

	/**
	 * [showRow description]
	 * @param  {[type]} row [description]
	 * @return {[type]}     [description]
	 */
	Filter.prototype.showRow = function(row) {
		row.style.display = 'table-row';
	};

	/**
	 * [hideRow description]
	 * @param  {[type]} row [description]
	 * @return {[type]}     [description]
	 */
	Filter.prototype.hideRow = function(row) {
		row.style.display = 'none';
	};

		/**
	 * [doesArrayContainTrue description]
	 * @todo  move to objects
	 * @param  {[type]} array [description]
	 * @return {[type]}       [description]
	 */
	Filter.prototype.doesArrayContainTrue = function(array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === true) {
				return true;
			}
		}
		return false;
	};


	if (!tableModules) {
		tableModules = {};
	}

	tableModules.Filter = Filter;

})(tableModules);