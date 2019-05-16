/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var mockIo = require('mock-stdio');

var liveTable = require('../');

function renderTable(opts, commands) {
  mockIo.start();

  try {
    var tbl = liveTable(opts);

    commands.forEach(function (cmd) {
      if (typeof cmd === 'function') {
        return cmd();
      }

      tbl[cmd[0]].apply(null, cmd[1]);
    });
  } catch (e) {
    mockIo.end();
    throw e;
  }

  var data = mockIo.end();

  expect(data).to.have.property('stderr', '');

  return data.stdout;
}

describe('[index]', function () {
  it('prints titles as-is', function () {
    var table = renderTable({}, [
      ['title', ['this is line 1']],
      ['title', ['this is line 2']],
      ['title', ['this is line 3']],
    ]);

    expect(table).to.equal('this is line 1\nthis is line 2\nthis is line 3\n');
  });

  it('prints empty lines', function () {
    var table = renderTable({}, [
      ['title', ['this is line 1']],
      ['line', ['this will not print']],
      ['title', ['this is line 3']],
    ]);

    expect(table).to.equal('this is line 1\n\nthis is line 3\n');
  });

  it('uses a single space to separate rows', function () {
    var table = renderTable({
      columns: [
        { size: 1 },
        { size: 1 },
        { size: 1 }
      ]
    }, [
      ['row', ['1', '2', '3']]
    ]);

    expect(table).to.equal('1 2 3\n');
  });

  it('can pad with a custom char', function () {
    var table = renderTable({
      columns: [
        { size: 3, char: '.' },
        { size: 3, char: ',' },
        { size: 3, char: 'p' }
      ]
    }, [
      ['row', ['1', '2', '3']]
    ]);

    expect(table).to.equal('1.. 2,, 3pp\n');
  });

  it('can left-align rows', function () {
    var table = renderTable({
      columns: [
        { size: 6, align: 'left' }
      ]
    }, [
      ['row', ['a']],
      ['row', ['ab']],
      ['row', ['abc']],
      ['row', ['abcd']],
      ['row', ['abcde']],
      ['row', ['abcdef']],
    ]);

    expect(table).to.equal([
      'a     ',
      'ab    ',
      'abc   ',
      'abcd  ',
      'abcde ',
      'abcdef'
    ].join('\n') + '\n');
  });

  it('can right-align rows', function () {
    var table = renderTable({
      columns: [
        { size: 6, align: 'right' }
      ]
    }, [
      ['row', ['a']],
      ['row', ['ab']],
      ['row', ['abc']],
      ['row', ['abcd']],
      ['row', ['abcde']],
      ['row', ['abcdef']],
    ]);

    expect(table).to.equal([
      '     a',
      '    ab',
      '   abc',
      '  abcd',
      ' abcde',
      'abcdef'
    ].join('\n') + '\n');
  });

  it('can center rows', function () {
    var table = renderTable({
      columns: [
        { size: 6, align: 'center' }
      ]
    }, [
      ['row', ['a']],
      ['row', ['ab']],
      ['row', ['abc']],
      ['row', ['abcd']],
      ['row', ['abcde']],
      ['row', ['abcdef']],
    ]);

    expect(table).to.equal([
      '   a  ',
      '  ab  ',
      '  abc ',
      ' abcd ',
      ' abcde',
      'abcdef'
    ].join('\n') + '\n');
  });

  it('aligns multiple rows', function () {
    var table1 = renderTable({
      columns: [
        { size: 5, align: 'left' },
        { size: 6, align: 'center' },
        { size: 7, align: 'right' }
      ]
    }, [
      ['row', ['a', 'b', 'c']],
      ['row', ['ab', 'bc', 'de']],
      ['row', ['abc', 'def', 'ghi']],
    ]);

    expect(table1).to.equal([
      'a        b         c',
      'ab      bc        de',
      'abc     def      ghi'
    ].join('\n') + '\n');

    var table2 = renderTable({
      columns: [
        { size: 5, align: 'right' },
        { size: 6, align: 'center' },
        { size: 7, align: 'left' }
      ]
    }, [
      ['row', ['a', 'b', 'c']],
      ['row', ['ab', 'bc', 'de']],
      ['row', ['abc', 'def', 'ghi']],
    ]);

    expect(table2).to.equal([
      '    a    b   c      ',
      '   ab   bc   de     ',
      '  abc   def  ghi    ',
    ].join('\n') + '\n');
  });

  it('ignores ansi colors when measuring strings');

  it('prints live, and other console.log calls will print in between', function () {
    var table = renderTable({
      columns: [
        { size: 5 },
        { size: 6 }
      ]
    }, [
      ['title', ['my table']],
      function () { console.log('pineapple'); },
      ['line', []],
      function () { console.log('strawberry'); },
      ['row', ['one', 'two']],
      function () { console.log('banana'); },
      ['row', ['three', 'four']]
    ]);

    expect(table).to.equal([
      'my table',
      'pineapple',
      '',
      'strawberry',
      'one   two   ',
      'banana',
      'three four  '
    ].join('\n') + '\n');
  });
});
