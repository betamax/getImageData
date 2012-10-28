#!/usr/bin/env node

var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');

var buf1 = new Buffer(5); buf1.write('abcde');
var buf2 = new Buffer(3); buf2.write('xyz');
var buf3 = new Buffer(5); buf3.write('11358');

var b = new BufferList;
b.push(buf1,buf2,buf3);

sys.puts(b.take(10)); // abcdexyz11
sys.puts(b.take(3)); // abc
sys.puts(b.take(100)); // abcdexyz11358
