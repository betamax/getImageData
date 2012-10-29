#!/usr/bin/env node
// Test joining lots of chunks into one buffer

var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var assert = require('assert');

exports.events = function () {
    var b = new BufferList({ encoding: 'binary' });
    var times = 0;
    
    var wrote = null;
    b.addListener('write', function (buf) {
        assert.eql(
            wrote.toString(),
            buf.toString(),
            'write callback gives its arguments'
        );
        times ++;
    });

    var buf1 = new Buffer(5); buf1.write('abcde');
    var buf2 = new Buffer(3); buf2.write('xyz');
    var buf3 = new Buffer(5); buf3.write('11358');
    
    var wrote = buf1; b.write(buf1);
    var wrote = buf2; b.write(buf2);
    
    assert.eql(times, 2, 'wrote twice');
    
    var wrote = buf3; b.write(buf3);
    
    assert.eql(times, 3, 'wrote thrice');
    
    assert.eql(b.take(), 'abcdexyz11358', 'entire buffer check');
    
    var advanced = 0;
    b.on('advance', function (n) {
        assert.eql(n, 3, 'n = 3 in advance callback')
        advanced ++;
    });
    b.advance(3);
    assert.eql(b.take(3), 'dex', 'advanced 3');
    assert.eql(advanced, 1, 'advance callback triggered once');
};

