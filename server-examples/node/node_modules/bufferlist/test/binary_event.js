var sys = require('sys');
var net = require('net');
var BufferList = require('bufferlist');
var Binary = require('bufferlist/binary');
var assert = require('assert');

function parser (sock) {
    var bufferList = new BufferList;
    sys.pump(sock, bufferList);
    
    return Binary(bufferList)
        .getWord16be('xLen')
        .when('xLen', 0, function (vars) {
            this
                .getWord32le('msgLen')
                .getBuffer('msg', 'msgLen')
                .tap(function (vars) {
                    vars.moo = 'msg:' + vars.msgLen + ':' + vars.msg;
                })
                .exit()
            ;
        })
        .getBuffer('xs', 'xLen')
        .tap(function (vars) {
            vars.moo = 'xs:' + vars.xLen + ':' + vars.xs;
        })
        .end()
    ;
}

exports['binary event'] = function () {
    function serverSession (port, strings, moo) {
        // fire up a server to write the strings when a client connects
        var server = net.createServer(function (stream) {
            strings.forEach(function (s) {
                stream.write(s);
            });
            stream.end();
            server.close();
        });
        server.listen(port);
        
        // connect to the server and parse its output
        var client = new net.Stream;
        parser(client).on('end', function (vars) {
            assert.eql(
                moo, vars.moo,
                'moo != ' + sys.inspect(moo) + ', moo == ' + sys.inspect(vars.moo)
            );
            client.end();
        });
        setTimeout(function () {
            client.connect(port);
        }, 50);
    }
    
    serverSession(20801,
        ['\x00','\x04m','eow'],
        'xs:4:meow'
    );
    
    serverSession(20802,
        ['\x00\x00','\x12\x00\x00\x00happy pur','ring c','ats'],
        'msg:18:happy purring cats'
    );
};

