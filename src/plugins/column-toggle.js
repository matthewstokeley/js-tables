
/**
 * [Columns description]
 * @param {[type]} options [description]
 */
export var ColumnToggle = function(options) {
	this.table = options.table;
	this.headerCells = options.headerCells;
	this.rows = options.tableRows;
	this.checkboxes = options.columnSorter;
	this.columns = this.mapColumns();
	this.listen();
};

/**
 * [listen description]
 * @return {[type]} [description]
 */
ColumnToggle.prototype.listen = function() {
	Array.prototype.forEach.call(this.checkboxes, this.addCheckboxListener.bind(this));
};

ColumnToggle.prototype.addCheckboxListener = function(checkbox, index) {
	checkbox.addEventListener('change', this.toggle.bind(this));
};

ColumnToggle.prototype.toggle = function(data) {
	this.setActiveColumn(data).updateElement();
};

/**
 * [setActiveColumn description]
 * @chainable
 * @param {[type]} checkbox [description]
 */
ColumnToggle.prototype.setActiveColumn = function(data) {
	this.activeColumn = {
		name: data.target.dataset.name,
		state: data.target.dataset.state,
		index: data.target.dataset.index,
		th: this.headerCells[data.target.dataset.index],
		columns: Array.prototype.map.call(this.columns, function(column) { return column[data.target.dataset.index]; }),
		checkbox: data.target
	};
	return this;
};

/**
 * [updateElement description]
 * @todo  refactor
 * @return {[type]} [description]
 */
ColumnToggle.prototype.updateElement = function() {
	Array.prototype.forEach.call(this.activeColumn.columns, this.updateColumn.bind(this));
	this.activeColumn.checkbox.dataset.state = this.activeColumn.state === 'active' ? 'inactive' : 'active'; 	
	this.activeColumn.th.style.display = this.activeColumn.state === 'active' ? 'none' : 'table-cell';
	this.activeColumn.th.dataset.state = this.activeColumn.state === 'active' ? 'inactive' : 'active';
	return this;
};

/**
 * [updateColumn description]
 * @param  {[type]} td [description]
 * @todo	refactor error checking
 * @return {[type]}    [description]
 */
ColumnToggle.prototype.updateColumn = function(td) {
	if (!td || td === undefined) { return false; }
	td.style.display = this.activeColumn.state === 'active' ? 'none' : 'table-cell';
	return this;
};

/**
 * [mapColumns description]
 * @return {[type]} [description]
 */
ColumnToggle.prototype.mapColumns = function() {
	return Array.prototype.map.call(this.rows, this.getCell.bind(this));
};

/**
 * [getCell description]
 * @param  {[type]} row [description]
 * @return {[type]}     [description]
 */
ColumnToggle.prototype.getCell = function(row) {
	return row.getElementsByTagName('td');
};

if (!tableModules) {
	tableModules = {};
}
