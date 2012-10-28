// Test BufferList#take().
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
        b.take('binary'),
        'abcdexyz11358',
        'take entire BufferList at once'
    );

    assert.eql(
        b.take(1, 'ascii'),
        'a',
        'take 1 byte with "ascii" encoding'
    );
    
    assert.ok(
        Buffer.isBuffer(b.take(1)),
        'take without encoding returns Buffer'
    );
    
    
    // Now set the encoding
    b.encoding = 'ascii';
    assert.ok(
        !Buffer.isBuffer(b.take(1)),
        'take with encoding returns String'
    );
};

