## Javascript Tables

0.0.6

ux options for html tables

### Demonstration

```

```

### Installation

```

//install
`npm install`

//build
grunt build


```

### Dependencies

`jsTables` requires a couple of functions from `jsObjects`, included here for convenience. 

### Plugins

`jsTables` has four plugins to provide common user-experience patterns 

1. ColumnSorter
2. ColumnToggle
3. Filter
4. Pagination

These are injected into the `Table` class, along with other options.

```
var dataTable = new Table({
    body: '',
    rows: '',
    headerCell '',
    columnSorter: ''
})

```


### API Documentation

