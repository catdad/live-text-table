<p align="center">
<img src="https://media1.tenor.com/images/22607bdddbe5f1ff86bffad4d592bc88/tenor.gif" width="400px" alt="We'll do it live">
</p>

# live-text-table

[![travis][travis.svg]][travis.link]
[![cov-coveralls][cov-coveralls.svg]][cov-coveralls.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]
[![dm-david][dm-david.svg]][dm-david.link]

[travis.svg]: https://travis-ci.com/catdad/live-text-table.svg?branch=master
[travis.link]: https://travis-ci.com/catdad/live-text-table
[cov-coveralls.svg]: https://coveralls.io/repos/github/catdad/live-text-table/badge.svg?branch=master
[cov-coveralls.link]: https://coveralls.io/github/catdad/live-text-table?branch=master
[npm-downloads.svg]: https://img.shields.io/npm/dm/live-text-table.svg
[npm.link]: https://www.npmjs.com/package/live-text-table
[npm-version.svg]: https://img.shields.io/npm/v/live-text-table.svg
[dm-david.svg]: https://david-dm.org/catdad/live-text-table.svg
[dm-david.link]: https://david-dm.org/catdad/live-text-table

Yet another library for printing tables to the terminal. In this case though, there is no expectation that you will have all the data ahead of time. Instead, you can set up your column definitions ahead of time, and data will be printed to the terminal as it is provided, allowing to provide feedback immediately as you fetch more and more data.

If you do have all you data already, consider using [`fancy-text-table`](https://github.com/catdad/fancy-text-table), which will be able to automatically size the columns for you.

## `require('live-text-table')({Object} options)` → Table

Initializes a new table. All options are optional, with the defaults resulting in printing directory to console similar to `console.log(param1, param2, param3, ...)`. The following options are available:

* `columns` _{Array[{Object}]}_: definitions for each column, in order. Each column has the following properties:
  * `size` _{Integer}_: the number of characters in each cell
  * `align` _{String}_: how to align the colums, either `left`, `right`, or `center`
  * `char` _{String}_: the character to use when padding the string for alignment
* `separator` _{String}_: the text to use to separate columns

```javascript
const table = require('live-text-table')({
  columns: [
    { size: 2, align: 'left' },
    { size: 45, align: 'left', char: chalk.gray('.') },
    { size: 10, align: 'right' }
  ],
  separator: ' | '
});
```

Each instance of a table has the following methods:

### `Table.title({String} title)`

Creates a title. This string will span across cells of a table, and not factor in cell alignment.

```javascript
table.title('This Is My Table');
```

### `Table.row(...args)`

Creates a row of items as defined in the table options. _Note that if a value is larger than the defined size, it will push the rest of the content and misalign that row in the table._

```javascript
table.row('1', 'value 1', 1234);
table.row('2', 'value 2', 5678);
table.row('3', 'value 3', 90);
```

### `Table.line()`

Creates an empty line in teh table. This is useful if you want to break up chunkcs of cells.

```javascript
table.line();
```

## Example

Full table example. Feel free to use colors anywhere you'd like to make your tables even prettier!

```javascript
const chalk = require('chalk');
const table = require('live-text-table')({
  columns: [
    { size: 2, align: 'left' },
    { size: 15, align: 'left', char: chalk.gray('.') },
    { size: 6, align: 'right' }
  ],
  separator: ' | '
});

table.title('My Fruits');
table.line();
table.row(chalk.dim('#1'), chalk.cyan('pineapples'), 1234);
table.row(chalk.dim('#2'), chalk.cyan('oranges'), 5678);
table.row(chalk.dim('#3'), chalk.cyan('bananas'), 90);

// My Fruits
//
// #1 | pineapples..... |   1234
// #2 | oranges........ |   5678
// #3 | bananas........ |     90

```
