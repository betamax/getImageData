// Check .into(), especially for object pollution
var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

exports.into = function () {
    var bList = new BufferList;
    var tapped = false;
    
    Binary(bList)
        .getWord8('ones')
        .into('frac', function () {
            this
                .getWord64be('64')
                .getWord32be('32')
                .getWord16be('16')
                .getWord8('8')
        })
        .tap(function (vars) {
            tapped = true;
            
            assert.eql(vars.ones, 3);
            assert.eql(vars.frac['64'], 73184615082362370);
            assert.eql(vars.frac['32'], 50661385);
            assert.eql(vars.frac['16'], 1801);
            assert.eql(vars.frac['8'], 3);
            
            assert.eql(
                Object.keys(vars).sort().join(' '), 'frac ones',
                'object pollution with .into()'
            )
        })
        .end()
    ;
    
    var buf = new Buffer(16);
    var i = 0;
    String(4 * Math.atan2(1,1)).split('').forEach(function (digit) {
        if (digit != '.') {
            buf[i++] = parseInt(digit,10);
        }
    });
    bList.push(buf);
    
    assert.ok(tapped, 'not tapped');
};

