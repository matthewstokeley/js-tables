
/**
 * [ColumnSorter description]
 * @param {[type]} options [description]
 */
export var ColumnSorter = function(options) {
	this.table = options.table;
	this.tableHeaders = options.tableHeaders;
	this.tableRows = options.tableRows;
	this.order = false;
	this.newRows = [];
	this.pagination = options.pagination || false;
	this.listen();
};

ColumnSorter.prototype.createColumns = function() {
};

/**
 * [listen description]
 * @return {[type]} [description]
 */
ColumnSorter.prototype.listen = function() {
	Array.prototype.forEach.call(this.tableHeaders, this.addEventListener.bind(this));
};

ColumnSorter.prototype.addEventListener = function(th, index) {
	th.addEventListener('click', function() { this.onClick.call(this, th, index); }.bind(this));
};

/**
 * [onClick description]
 * @param  {[type]} th               [description]
 * @param  {[type]} tableHeaderIndex [description]
 * @return {[type]}                  [description]
 */
ColumnSorter.prototype.onClick = function(th, tableHeaderIndex) {
	this.appendNewRows(th, tableHeaderIndex).updateOrder(th).reset();
	events.emit('columnSorted');
};

ColumnSorter.prototype.updateOrder = function(th) {
	this.order = this.updateTableHeader.call(this, this.order, th);
	return this;
};

ColumnSorter.prototype.appendNewRows = function(th, tableHeaderIndex) {
	this.table.innerHTML = this.createNewRows(th, tableHeaderIndex).join('');
	return this;
};

ColumnSorter.prototype.reset = function() {
	this.resetNewRows();
	this.checkInputs();
	this.initPagination();
	return this;
};

ColumnSorter.prototype.getColumn = function(tableHeaderIndex) {
	return Array.prototype.map.call(this.tableRows, function(row, index) { return this.findColumn(row, index, tableHeaderIndex); }.bind(this));	
};

ColumnSorter.prototype.getColumnValues = function(column) {
	return column.map(this.findColumnValue);
};

ColumnSorter.prototype.getSortedValues = function(th, tableHeaderIndex) {
	return this.sortValues.call(this,  this.getColumnValues(this.getColumn(tableHeaderIndex)), th, this.tableRows);
};

ColumnSorter.prototype.getSortedRows = function(th, tableHeaderIndex) {
	return this.getSortedValues(th, tableHeaderIndex).map(function(value) { return this.sortRows.call(this, value, this.tableRows, tableHeaderIndex); }.bind(this));
};

ColumnSorter.prototype.createNewRows = function(th, tableHeaderIndex) {
	// create the html
	this.newRows = this.getSortedRows(th, tableHeaderIndex).map(function(row, index) {

		return $$.createElement({
			element: "div",
			properties: {
				childNode: row
			}
		}).innerHTML;
		
	}.bind(this));

	return this.newRows;
};

ColumnSorter.prototype.resetNewRows = function() {
	this.newRows = [];
	return this;
};

ColumnSorter.prototype.initPagination = function() {
	if (this.pagination) {
		this.pagination.init();
	}
	return this;
};


/**
 * [findColumn description]
 * @param  {[type]} row              [description]
 * @param  {[type]} index            [description]
 * @param  {[type]} tableHeaderIndex [description]
 * @return {[type]}                  [description]
 */
ColumnSorter.prototype.findColumn = function(row, index, tableHeaderIndex) {
	return row.getElementsByTagName('td')[tableHeaderIndex];
};

/**
 * [findColumnValue description]
 * @param  {[type]} column [description]
 * @return {[type]}        [description]
 */
ColumnSorter.prototype.findColumnValue = function(column) {
	var span = column.getElementsByTagName('span');
	if(span && span[0] && span[0].dataset && span[0].dataset.value) {
		return { 
			column: column,
			value: span[0].dataset.value
		};
	}
};

/**
 * [updateValues description]
 * @return {[type]} [description]
 */
ColumnSorter.prototype.updateTableHeader = function(order, th) {
	
	switch(order) {
		case false:
			this.toggleTableHeaderClass(th, 'asc');
			return 'asc';

		case 'asc':
			this.toggleTableHeaderClass(th, 'desc');
			return 'desc';

		case 'desc':
			this.toggleTableHeaderClass(th, 'asc');
			return 'asc';
	}
};

/**
 * [sortValues description]
 * @todo  check number or string
 * @param  {[type]} values [description]
 * @param  {[type]} th     [description]
 * @param  {[type]} rows   [description]
 * @return {[type]}        [description]
 */
ColumnSorter.prototype.sortValues = function(columns, th, rows) {
		
	return columns.sort(function(current, next) {
		if (this.order === false || this.order === 'desc') {
			
			return alphabetize(next.value) - alphabetize(current.value);
		} else if (this.order === 'asc') {
			return alphabetize(current.value) - alphabetize(next.value);
		}
	}.bind(this));

};

/**
 * [toggleTableHeaderClass description]
 * @todo  refactor
 * @param  {[type]} order [description]
 * @return {[type]}       [description]
 */
ColumnSorter.prototype.toggleTableHeaderClass = function(th, order) {
	// @todo remove by prefix
	$$.removeClass(th, 'header__column--asc');
	$$.removeClass(th, 'header__column--desc');
	$$.addClass(th, 'header__column--' + order);
	th.dataset.direction = order;
};

/**
 * [sortRows description]
 * @param  {[type]} sortedValues     [description]
 * @param  {[type]} rows             [description]
 * @param  {[type]} tableHeaderIndex [description]
 * @return {[type]}                  [description]
 */
ColumnSorter.prototype.sortRows = function(value, rows, tableHeaderIndex) {
	rows = Array.prototype.filter.call(rows, function(row) {
		var column = row.getElementsByTagName('td')[tableHeaderIndex];
		if (column === value.column) {
			return row === undefined ? false : row;
		}
	}.bind(this));
	return rows[0];
};

ColumnSorter.prototype.checkInputs = function() {
	var inputs = this.table.getElementsByTagName('input');
	Array.prototype.forEach.call(inputs, function(input) {
		if (input.dataset && input.dataset.checked && (input.dataset.checked === 'true')) {
			input.checked = true;
		}
	});

	return this;
};

