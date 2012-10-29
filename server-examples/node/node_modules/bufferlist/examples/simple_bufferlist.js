#!/usr/bin/env node
var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');

var b = new BufferList;
['abcde','xyz','11358'].forEach(function (s) {
    var buf = new Buffer(s.length);
    buf.write(s);
    b.push(buf);
});

sys.puts(b.take(10)); // abcdexyz11
