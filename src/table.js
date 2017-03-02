var Table = function Table(options) {
	
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
