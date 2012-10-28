BufferList
==========
BufferList provides an interface to treat a linked list of buffers as a single
stream. This is useful for events that produce a many small Buffers, such as
network streams.

Installation
============
Install using npm:
    npm install bufferlist

Or, check out the repository and have npm link to your development copy. This
is useful for developing the library, and is necessary when running the tests,
since they refer to the installed names of the library files.
    git clone http://github.com/substack/node-bufferlist.git 
    cd node-bufferlist
    npm link .

Simple Bufferlist Example
=========================
    
    #!/usr/bin/env node
    var sys = require('sys');
    var Buffer = require('buffer').Buffer;
    var BufferList = require('bufferlist').BufferList;

    var b = new BufferList;
    ['abcde','xyz','11358'].forEach(function (s) {
        var buf = new Buffer(s.length);
        buf.write(s);
        b.push(buf);
    });

    sys.puts(b.take(10)); // abcdexyz11

Binary
======
This distribution also contains a Binary module for parsing these bufferlists.

Simple Binary Example
=====================

    #!/usr/bin/env node

    var sys = require('sys');
    var Buffer = require('buffer').Buffer;
    var BufferList = require('bufferlist').BufferList;
    var Binary = require('bufferlist/binary').Binary;

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

See Also
========
See the examples/ directory for more involved examples.

See http://github.com/substack/node-rfb for a practical application of this
distribution.
