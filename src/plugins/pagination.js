/**
 * [Pagination description]
 * @param {[type]} options [description]
 */
export var Pagination = function(options) {
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

