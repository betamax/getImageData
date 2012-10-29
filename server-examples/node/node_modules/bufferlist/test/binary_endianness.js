#!/usr/bin/env node
// Test binary byte and endianness functions
var sys = require('sys');
var Buffer = require('buffer').Buffer;
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

exports.endianness = function () {
    var bList = new BufferList;

    Binary(bList)
        .getWord8('w8')
        .tap(function (vars) {
            assert.eql(vars.w8, 239, 'w8 is not 239')
        })
        // 16 bit functions
        .getWord16le('w16le')
        .tap(function (vars) {
            assert.eql(vars.w16le, 23569, 'w16le is not 23569');
        })
        .getWord16be('w16be')
        .tap(function (vars) {
            assert.eql(vars.w16be, 23569, 'w16be is not 23569');
        })
        .getWord16les('w16les')
        .tap(function (vars) {
            assert.eql(vars.w16les, -239, 'w16les is not -239');
        })
        .getWord16bes('w16bes')
        .tap(function (vars) {
            assert.eql(vars.w16bes, -239, 'w16bes is not -239');
        })
        .getWord16les('w16lesu')
        .tap(function (vars) {
            assert.eql(vars.w16lesu, 23569, 'w16lesu is not -239');
        })
        .getWord16bes('w16besu')
        .tap(function (vars) {
            assert.eql(vars.w16besu, 23569, 'w16besu is not -239');
        })
        // 32 bit functions
        .getWord32le('w32le')
        .tap(function (vars) {
            assert.eql(vars.w32le, 287454020, 'w32le is not 287454020');
        })
        .getWord32be('w32be')
        .tap(function (vars) {
            assert.eql(vars.w32be, 287454020, 'w32be is not 287454020');
        })
        .getWord32les('w32les')
        .tap(function (vars) {
            assert.eql(vars.w32les, -16742383, 'w32les is not -16742383');
        })
        .getWord32bes('w32bes')
        .tap(function (vars) {
            assert.eql(vars.w32bes, -16742383, 'w32bes is not -16742383');
        })
        .getWord32les('w32lesu')
        .tap(function (vars) {
            assert.eql(vars.w32lesu, 2076074948, 'w32lesu is not 2076074948');
        })
        .getWord32bes('w32besu')
        .tap(function (vars) {
            assert.eql(vars.w32besu, 2076074948, 'w32besu is not 2076074948');
        })
        // 64 bit functions
        .getWord64le('w64le')
        .tap(function (vars) {
            assert.eql(vars.w64le, 9833440827789222417, 'w64le is not 9833440826932474692');
        })
        .getWord64be('w64be')
        .tap(function (vars) {
            assert.eql(vars.w64be, 9833440827789222417, 'w64be is not 9833440826932474692');
        })
        .getWord64les('w64les')
        .tap(function (vars) {
            assert.eql(vars.w64les, -8613303245920330000, 'w64les is not -8613303245920330000');
        })
        .getWord64bes('w64bes')
        .tap(function (vars) {
            assert.eql(vars.w64bes, -8613303245920330000, 'w64bes is not -8613303245920330000');
        })
        .getWord64les('w64lesu')
        .tap(function (vars) {
            assert.eql(vars.w64lesu, 5337084636995872375, 'w64lesu is not 5337084636995872375');
        })
        .getWord64bes('w64besu')
        .tap(function (vars) {
            assert.eql(vars.w64besu, 5337084636995872375, 'w64besu is not 5337084636995872375');
        })
        .end()
    ;

    var b8 = new Buffer(1);
    b8[0] = 239;
    bList.push(b8);

    // 16 bit functions

    var b16le = new Buffer(2);
    b16le[0] = 0x11;
    b16le[1] = 0x5C;
    bList.push(b16le);

    var b16be = new Buffer(2);
    b16be[0] = 0x5C;
    b16be[1] = 0x11;
    bList.push(b16be);

    var b16les = new Buffer(2);
    b16les[0] = 0x11;
    b16les[1] = 0xFF;
    bList.push(b16les);

    var b16bes = new Buffer(2);
    b16bes[0] = 0xFF;
    b16bes[1] = 0x11;
    bList.push(b16bes);

    var b16lesu = new Buffer(2);
    b16lesu[0] = 0x11;
    b16lesu[1] = 0x5C;
    bList.push(b16lesu);

    var b16besu = new Buffer(2);
    b16besu[0] = 0x5C;
    b16besu[1] = 0x11;
    bList.push(b16besu);

    // 32 bit functions

    var b32le = new Buffer(4);
    b32le[0] = 0x44;
    b32le[1] = 0x33;
    b32le[2] = 0x22;
    b32le[3] = 0x11;
    bList.push(b32le);

    var b32be = new Buffer(4);
    b32be[0] = 0x11;
    b32be[1] = 0x22;
    b32be[2] = 0x33;
    b32be[3] = 0x44;
    bList.push(b32be);

    var b32les = new Buffer(4);
    b32les[0] = 0x11;
    b32les[1] = 0x88;
    b32les[2] = 0x00;
    b32les[3] = 0xFF;
    bList.push(b32les);

    var b32bes = new Buffer(4);
    b32bes[0] = 0xFF;
    b32bes[1] = 0x00;
    b32bes[2] = 0x88;
    b32bes[3] = 0x11;
    bList.push(b32bes);

    var b32lesu = new Buffer(4);
    b32lesu[0] = 0xC4;
    b32lesu[1] = 0x63;
    b32lesu[2] = 0xBE;
    b32lesu[3] = 0x7B;
    bList.push(b32lesu);

    var b32besu = new Buffer(4);
    b32besu[0] = 0x7B;
    b32besu[1] = 0xBE;
    b32besu[2] = 0x63;
    b32besu[3] = 0xC4;
    bList.push(b32besu);

    // 64 bit functions

    var b64le = new Buffer(8);
    b64le[0] = 0x11;
    b64le[1] = 0x22;
    b64le[2] = 0x33;
    b64le[3] = 0x44;
    b64le[4] = 0x55;
    b64le[5] = 0x66;
    b64le[6] = 0x77;
    b64le[7] = 0x88;
    bList.push(b64le);

    var b64be = new Buffer(8);
    b64be[0] = 0x88;
    b64be[1] = 0x77;
    b64be[2] = 0x66;
    b64be[3] = 0x55;
    b64be[4] = 0x44;
    b64be[5] = 0x33;
    b64be[6] = 0x22;
    b64be[7] = 0x11;
    bList.push(b64be);

    var b64les = new Buffer(8);
    b64les[0] = 0x11;
    b64les[1] = 0x22;
    b64les[2] = 0x33;
    b64les[3] = 0x44;
    b64les[4] = 0x55;
    b64les[5] = 0x66;
    b64les[6] = 0x77;
    b64les[7] = 0x88;
    bList.push(b64les);

    var b64bes = new Buffer(8);
    b64bes[0] = 0x88;
    b64bes[1] = 0x77;
    b64bes[2] = 0x66;
    b64bes[3] = 0x55;
    b64bes[4] = 0x44;
    b64bes[5] = 0x33;
    b64bes[6] = 0x22;
    b64bes[7] = 0x11;
    bList.push(b64bes);

    var b64lesu = new Buffer(8);
    b64lesu[0] = 0x77;
    b64lesu[1] = 0x66;
    b64lesu[2] = 0x55;
    b64lesu[3] = 0x44;
    b64lesu[4] = 0x33;
    b64lesu[5] = 0x22;
    b64lesu[6] = 0x11;
    b64lesu[7] = 0x4A;
    bList.push(b64lesu);

    var b64besu = new Buffer(8);
    b64besu[0] = 0x4A;
    b64besu[1] = 0x11;
    b64besu[2] = 0x22;
    b64besu[3] = 0x33;
    b64besu[4] = 0x44;
    b64besu[5] = 0x55;
    b64besu[6] = 0x66;
    b64besu[7] = 0x77;
    bList.push(b64besu);
};

