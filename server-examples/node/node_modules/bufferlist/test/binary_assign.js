// Test .into and hierarchical addressing assignment
var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

exports['binary assign'] = function () {
    var tapped = 0;
    var bList = new BufferList;

    Binary(bList)
        .getWord16be('foo','bar','baz')
        .tap(function (vars) {
            assert.eql(
                vars.foo.bar.baz, 24930,
                'vars.foo.bar.baz != 24930, '
                + 'vars.foo.bar.baz == ' + sys.inspect(vars.foo.bar.baz)
            );
            tapped ++;
        })
        .getWord32le(['one','two','three'])
        .tap(function (vars) {
            assert.eql(
                vars.one.two.three, 1717920867,
                'vars.one.two.three != 1717920867, '
                + 'vars.one.two.three == ' + sys.inspect(vars.one.two.three)
            );
            tapped ++;
        })
        .into(['what.the','fuck'],function () {
            this
                .getWord8('w')
                .getWord8('t')
                .getWord8('f')
                .getWord32le('?!')
                .tap(function (vars) {
                    vars.meow = 9000;
                })
            ;
        })
        .tap(function (vars) {
            assert.eql(
                vars.what.the.fuck.w, 119,
                '.w != 119, .w == ' + vars.what.the.fuck.w
            );
            assert.eql(
                vars.what.the.fuck.t, 116,
                '.t != 119, .t == ' + vars.what.the.fuck.t
            );
            assert.eql(
                vars.what.the.fuck.f, 102,
                '.f != 119, .f == ' + vars.what.the.fuck.f
            );
            assert.eql(
                vars.what.the.fuck['?!'], 825303359,
                '.?! != 825303359, .?! == ' + vars.what.the.fuck['?!']
            );
            assert.eql(
                vars.what.the.fuck['meow'], 9000,
                '.meow != 9000, .meow == ' + vars.what.the.fuck.meow
            );
            tapped ++;
        })
        .end()
    ;
    
    var buf = new Buffer(13);
    buf.write('abcdefwtf?!11');
    bList.push(buf);
    assert.eql(tapped, 3, 'tapped != 3, tapped == ' + tapped);
};

