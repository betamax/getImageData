#!/usr/bin/env node

var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');

var bufferList = new BufferList;
var binary = Binary(bufferList)
    .getWord16be('xLen')
    .getBuffer('xs', 'xLen')
    .tap(function (vars) {
        vars.moo = 'xs:' + vars.xLen + ':' + vars.xs;
    })
    .end()
;

var buf = new Buffer(6);
buf.write('\x00\x04meow', 'binary');
bufferList.push(buf);

sys.puts(binary.vars.moo); // xs:4:meow
