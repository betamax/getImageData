// Test the binary interface to bufferlists
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist').BufferList; // old style
var Binary = require('bufferlist/binary').Binary; // old style
var sys = require('sys');
var assert = require('assert');

exports.binary = function () {
    function runTest(bufs, check) {
        var bList = new BufferList;
        
        var binary = Binary(bList)
            .getWord16be('xLen')
            .when('xLen', 0, function (vars) {
                assert.eql(vars.xLen, 0, 'when check for 0 failed');
                this
                    .getWord32le('msgLen')
                    .getBuffer('msg', function (vars) {
                        return vars.msgLen
                    })
                    .tap(function (vars) {
                        vars.moo = 42;
                    })
                    .exit()
                ;
            })
            .getBuffer('xs', 'xLen')
            .tap(function (vars) {
                vars.moo = 100;
            })
            .end()
        ;
        
        var iv = setInterval(function () {
            var buf = bufs.shift();
            if (!buf) {
                clearInterval(iv);
                check(binary.vars);
            }
            else {
                bList.push(buf);
            }
        }, 50);
    }

    runTest(
        ['\x00','\x04m','eow'].map(function (s) {
            var b = new Buffer(Buffer.byteLength(s,'binary'));
            b.write(s,'binary');
            return b;
        }),
        function (vars) {
            assert.eql(
                vars.xLen,
                4,
                'xLen == 4 failed (xLen == ' + sys.inspect(vars.xLen) + ')'
            );
            
            var xs = vars.xs.toString();
            assert.eql(
                xs, 'meow', 'xs != "meow", xs = ' + sys.inspect(xs)
            );
            assert.eql(
                vars.moo, 100, 'moo != 100, moo == ' + sys.inspect(vars.moo)
            );
        }
    );

    runTest(
        ['\x00\x00','\x12\x00\x00\x00hap','py pur','ring c','ats']
        .map(function (s) {
            var b = new Buffer(Buffer.byteLength(s,'binary'));
            b.write(s,'binary');
            return b;
        }),
        function (vars) {
            assert.eql(vars.xLen, 0, 'xLen == 0 in "\\x00\\x12happy purring cats"');
            assert.eql(
                vars.msgLen, 18,
                'msgLen != 18, msgLen = ' + sys.inspect(vars.msgLen)
            );
            assert.eql(vars.moo, 42, 'moo != 42');
        }
    );
};

