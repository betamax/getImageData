// Test binary looping functions
var sys = require('sys');

var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

exports['binary loop'] = function () {
    // test repeat
    var reps = 0;
    var trickyList = [];

    Binary(new BufferList)
        .repeat(5000, function(vars, n) {
            reps++;
        })
        .tap(function (vars) {
            assert.eql(
                reps, 5000, 'reps != 5000, reps == ' + reps + ' in repeat test'
            );
        })
        .repeat(3, function (vars, i) {
            this
                .repeat(4, function (vars, j) {
                    trickyList.push([ i + 1, j + 1 ]);
                })
            ;
        })
        .tap(function (vars) {
            expectedTrickyList = [
                [1,1],[1,2],[1,3],[1,4],
                [2,1],[2,2],[2,3],[2,4],
                [3,1],[3,2],[3,3],[3,4]
            ];
            for (var i = 0; i < trickyList.length; i++) {
                assert.eql(
                    trickyList[i][0],
                    expectedTrickyList[i][0],
                    'trickly list is not what it should be. it should be: ' +
                        sys.inspect(expectedTrickyList) + '. it is: ' +
                        sys.inspect(trickyList)
                );
                assert.eql(
                    trickyList[i][1],
                    expectedTrickyList[i][1],
                    'trickly list is not what it should be. it should be: ' +
                        sys.inspect(expectedTrickyList) + '. it is: ' +
                        sys.inspect(trickyList)
                );
            }
        })
        .end()
    ;

    assert.eql(reps, 5000, 'reps != 5000, reps == ' + reps + ' in outer repeat check');

    var bufferList = new BufferList;
    var loops = 0;
    Binary(bufferList)
        .forever(function () {
            this
                .getWord16be('moo','count')
                .tap(function (vars) {
                    assert.eql(
                        vars.moo.count, 100,
                        'count != 100, count == ' + vars.moo.count
                    );
                    vars.reps = 0;
                })
                .repeat('moo.count', function (vars, i) {
                    this
                        .getWord16be('size')
                        .tap(function (vars) {
                            assert.eql(
                                vars.size, 1000,
                                'size != 1000, size == ' + vars.size
                            );
                        })
                        .getBuffer('block', 'size')
                    ;
                    vars.reps ++;
                })
                .tap(function (vars) {
                    assert.eql(
                        vars.reps, 100, 'reps != 100, reps == ' + vars.reps
                    );
                })
            ;
            loops ++;
            if (loops == 20) this.exit();
        })
        .end()
    ;
    
    for (var n = 0; n < 20; n++) {
        var countBuf = new Buffer(2);
        countBuf[0] = 100 >> 8;
        countBuf[1] = 100 % 256;
        bufferList.push(countBuf);
        
        for (var i = 0; i < 100; i++) {
            var buf = new Buffer(1000 + 2);
            buf[0] = 1000 >> 8;
            buf[1] = 1000 % 256;
            for (var j = 0; j < 1000; j++) {
                buf[j + 2] = j;
            }
            bufferList.push(buf);
        }
    }
    
    assert.eql(loops, 20, 'loops != 20, loops == ' + loops);
};

