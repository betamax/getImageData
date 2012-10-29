// Jumping around in a binary parser
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

Number.prototype.upTo = function (n) {
    var acc = [];
    for (var i = Number(this); i <= n; i++) {
        acc.push(i);
    }
    return acc;
};

Number.prototype.downTo = function (n) {
    var acc = [];
    for (var i = Number(this); i >= n; i--) {
        acc.push(i);
    }
    return acc;
};

Array.prototype.zip = function (xs) {
    var arr = this;
    return (0).upTo(this.length - 1).map(function (i) {
        return [ arr[i], xs[i] ];
    });
};

exports.jump = function () {
    var tapped = 0;

    var bList = new BufferList;

    Binary(bList)
        .skip(3)
        .getWord16be('de')
        .tap(function (vars) {
            var de = 256 * 'd'.charCodeAt(0) + 'e'.charCodeAt(0);
            assert.eql(
                vars.de, de,
                'getWord16be at 3 should be ' + de + ', not ' + vars.de
            );
            tapped ++;
        })
        .end()
    ;

    var buf1 = new Buffer(5); buf1.write('abcde');
    var buf2 = new Buffer(3); buf2.write('xyz');
    var buf3 = new Buffer(5); buf3.write('11358');
    bList.push(buf1,buf2,buf3);
    assert.eql(tapped, 1, 'not tapped');
};

