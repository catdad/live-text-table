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

var align = {
  left: pad.right,
  right: pad.left,
  center: pad.center
};

module.exports = function (opts) {
  var columns = (opts && opts.columns) || [];
  var sep = (opts && opts.separator) || ' ';
  var sepLength = sep.length;
  var defaultAlign = 'left';
  var defaultChar = ' ';
  var defaultSize = 0;

  function formatRow(val, idx) {
    if (!columns[idx]) {
      return val;
    }

    var aligner = align[columns[idx].align] || align[defaultAlign];
    return aligner(val, columns[idx].size || defaultSize, columns[idx].char || defaultChar);
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
        return memo + formatRow(val, idx) + sep;
      }, '').slice(0, sepLength * -1));
    }
  };

  return api;
};
