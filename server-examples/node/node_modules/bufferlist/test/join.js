// Test joining lots of chunks into one buffer
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var assert = require('assert');

exports.join = function () {
    var buf1 = new Buffer(5); buf1.write('abcde');
    var buf2 = new Buffer(3); buf2.write('xyz');
    var buf3 = new Buffer(5); buf3.write('11358');

    var b = new BufferList;
    b.push(buf1,buf2,buf3);

    assert.eql(
        b.join().toString('ascii',0,b.length),
        'abcdexyz11358',
        'join multiple chunks into one Buffer'
    );

    assert.eql(
        b.join(3,6).toString(),
        'dex',
        'slice of a buffer join'
    );
};

