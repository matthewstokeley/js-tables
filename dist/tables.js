var tableModules = {};;(function(tableModules) {
	
	/**
	 * [ColumnSorter description]
	 * @param {[type]} options [description]
	 */
	var ColumnSorter = function(options) {
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
	
	if (!tableModules) {
		tableModules = {};
	}

	tableModules.ColumnSorter = ColumnSorter;

})(tableModules);;(function(tableModules) {
	/**
	 * [Columns description]
	 * @param {[type]} options [description]
	 */
	var ColumnToggle = function(options) {
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
		console.log(data.target.dataset.index);
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

	tableModules.ColumnToggle = ColumnToggle;

})(tableModules);;(function(tableModules) {

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

})(tableModules);;(function(tableModules) {
	
	/**
	 * [Pagination description]
	 * @param {[type]} options [description]
	 */
	var Pagination = function(options) {
		this.pages = [];
		this.table = options.table;
		this.th = document.getElementsByTagName('th');
		this.rows = this.table.getElementsByTagName('tr');
		this.itemsPerPage = options.itemsPerPage;
		this.statusElement = document.getElementById('pagination-current');
		this.navElement = document.getElementById('pagination-nav');
		this.navLinks = document.getElementsByClassName('pagination__link');
		this.init.call(this);
		this.listen.call(this);
	};

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.init = function() {
		this.paginate.call(this);
		this.pageNumber = this.getPageNumber.call(this);
		this.showPage.call(this);
		this.updateStatusElement.call(this);
		this.updateNavigationTemplate.call(this);
	};

	/**
	 * [listen description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.listen = function() {
		Array.prototype.forEach.call(this.navLinks, function(link) {
			link.addEventListener('click', function() {
				this.changePages(link);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * [paginate description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.paginate = function() {
		this.pages = [];
		var j = 0;
		var page = [];
		for (var i = 0; i < this.rows.length; i++) {
			 if (j === this.itemsPerPage) {
				j = 0;
				this.pages.push(page);
				page = [];
			}
			// refactor to get remainder
			this.hideRow(this.rows[i]);
			page.push(this.rows[i]);
			j++;
		}

		// get the remainder
		page = [];
		i = this.rows.length - (this.rows.length - (this.pages.length * this.itemsPerPage));

		while (i < this.rows.length) {
			page.push(this.rows[i]);
			i++;
		}
		this.pages.push(page);
	
	};

	/**
	 * [updateStatusElement description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.updateStatusElement = function() {
		this.statusElement.innerHTML = this.pageNumber + '/' + this.pages.length;
	};

	/**
	 * [updateNavigationTemplate description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.updateNavigationTemplate = function() {

	};

	/**
	 * [getWindowHash description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.getWindowHash = function() {
		return window.location.hash;
	};

	/**
	 * [findPageNumber description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.findPageNumber = function(hash) {
		return parseInt(hash.match(new RegExp(/\#page=([0-9]*)/))[1], 10);
	};

	/**
	 * [getPageNumber description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.getPageNumber = function() {
		return this.getWindowHash() === '' ? 1 : this.findPageNumber(this.getWindowHash());
	};

	/**
	 * [changePages description]
		 * @param  {[type]} link [description]
	 * @return {[type]}      [description]
	 */
	Pagination.prototype.changePages = function(link) {
		this.nextPage = 1;
		if (link.dataset.direction === 'forward' && this.pageNumber < this.pages.length) {
			this.nextPage = this.pageNumber + 1;
		} else if (link.dataset.direction === 'back' && this.pageNumber > 1) {
			this.nextPage = this.pageNumber - 1;
		}

		window.location.hash = '#page=' + this.nextPage;
		this.init();

	};

	/**
	 * [getPageTotal description]
	 * @return {[type]} [description]
	 */
	Pagination.prototype.getPageTotal = function getPageTotal() {
		return this.pages.length;
	};

	/**
	 * [showPage description]
	 * @return {[type]} [descaription]
	 */
	Pagination.prototype.showPage = function() {
		this.pages[this.pageNumber - 1].forEach(this.showRow);
	};

	/**
	 * [showRow description]
	 * @param  {[type]} row [description]
	 * @return {[type]}     [description]
	 */
	Pagination.prototype.showRow = function(row) {
		row.style.display = 'table-row';
	};

	/**
	 * [hideRow description]
	 * @param  {[type]} row [description]
	 * @return {[type]}     [description]
	 */
	Pagination.prototype.hideRow = function(row) {
		row.style.display = 'none';
	};

	if (!tableModules) {
		tableModules = {};
	}

	tableModules.Pagination = Pagination;

})(tableModules);;var Table = function Table(options) {
	
	var table = document.getElementById(options.body);
	var tableRows = document.getElementsByClassName(options.rows);
	var headerCells = document.getElementsByClassName(options.headerCell);
	var columnSorter = document.getElementsByClassName(options.columnSorter);

	var pagination;
	try {
		pagination = new tableModules.Pagination({
			table: table,
			itemsPerPage: options.pagination.itemsPerPage
		});
	} catch(e) {
		console.trace(e);
	}

	var initColumnSorter = function initColumnSorter() {
		var sorter;
		try {
			sorter = new tableModules.ColumnSorter({
				table: table,
				tableHeaders: headerCells,
				tableRows: tableRows,
				pagination: pagination
			});
		} catch(e) {
			console.trace(e);
		}
		return sorter;
	};

	var initFilter = function initFilter() {
		var filter;
		try {
			filter = new tableModules.Filter({
				table: table,
				input: document.getElementById(options.filter),
				tableRows: tableRows,
				pagination: pagination
			});
		} catch(e) {
			console.trace(e);
		}
		return filter;
	};

	var initColumnToggle = function initColumnToggle() {
		var toggle;
		try {
			toggle = new tableModules.ColumnToggle({
				table: table,
				headerCells: headerCells,
				tableRows: tableRows,
				columnSorter: columnSorter
			});
		} catch(e) {
			console.trace(e);
		}
		return toggle;
	};

	var modules = __.mapMethods({
		fn: [initColumnSorter, initFilter, initColumnToggle],
		args: []
	});

};
