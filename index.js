/* jshint node:true */
var unstyle = require('unstyle');

function strLength(str) {
  return unstyle.string(str).length;
}

var pad = {
  left: function (val, len, char) {
    if (strLength(val) < len) {
      return pad.left(char + val, len, char);
    }

    return val;
  },
  right: function (val, len, char) {
    if (strLength(val) < len) {
      return pad.right(val + char, len, char);
    }

    return val;
  },
  center: function (val, len, char) {
    var strLen = strLength(val);

    if (strLen >= len) {
      return val;
    }

    var side = strLen % 2 === 0 ? pad.right : pad.left;
    return pad.center(side(val, strLen + 1, char), len, char);
  }
};

module.exports = function (opts) {
  var columns = opts.columns;
  var defaultAlign = 'left';
  var defaultChar = ' ';
  var defaultSize = 0;
  var defaultSep = ' ';

  function formatRow(val, idx) {
    if (!columns[idx]) {
      return val;
    }

    var align = pad[columns[idx].align] || pad[defaultAlign];
    return align(val, columns[idx].size || defaultSize, columns[idx].char || defaultChar);
  }

  var api = {
    title: function (str) {
      console.log(str);
    },
    line: function () {
      console.log('');
    },
    row: function () {
      console.log([].reduce.call(arguments, function (memo, val, idx) {
        return memo + formatRow(val, idx) + defaultSep;
      }, '').slice(0, -1));
    }
  };

  return api;
};
