var BufferList = require('bufferlist');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = Binary;
module.exports.Binary = Binary; // backwards compatibility

Binary.prototype = new EventEmitter;
function Binary(buffer) {
    if (!(this instanceof Binary)) return new Binary(buffer);
    var self = this;

    this.vars = {};
    this.offset = 0;
    this.actions = [];
    this.parent = null;
    
    // an explicit end loads all the actions before any evaluation happens
    this.end = function () {
        if (buffer.listeners('write').indexOf(update) < 0) {
            buffer.on('write', update);
        }
        update();
        return this;
    };
    
    // Signify to the parent that processing should stop.
    this.exit = function () {
        this.pushAction({
            ready : true,
            action : function () {
                this.actions = [];
                if (this.parent) this.parent.actions = [];
            },
        });
        return this;
    };
    
    function update () {
        var action = self.actions[0];
        if (!action) {
            buffer.removeListener('write', update);
            self.emit('end', self.vars);
        }
        else if (action.ready.call(self, self.vars)) {
            self.actions.shift();
            
            if (action.context == false) {
                action.action.call(self, self.vars);
                self.end();
            }
            else {
                buffer.removeListener('write', update);
                
                var child = new Binary(buffer);
                child.vars = self.vars;
                child.parent = self;
                child.offset = self.offset;
                
                child.on('end', function () {
                    self.offset = child.offset;
                    buffer.on('write', update);
                    self.end();
                });
                
                action.action.call(child, child.vars);
                child.end();
            }
        }
    }
    
    this.pushAction = function (action) {
        if (!action) throw "Action not specified";
        var ready = {
            'function' : action.ready,
            'boolean' : function () { return action.ready },
        }[typeof(action.ready)];
        if (!ready) throw "Unknown action.ready type";
        this.actions.push({
            'action' : action.action,
            'ready' : ready,
            'context' : action.context || false,
        });
    };
    
    this.flush = function () {
        this.pushAction({
            ready : true,
            action : function () {
                buffer.advance(this.offset);
                this.offset = 0;
            },
        });
        return this;
    };
    
    this.skip = function (bytes) {
        this.pushAction({
            ready : true,
            action : function () {
                this.offset += bytes;
            },
        });
        return this;
    };
    
    this.tap = function (f) {
        this.pushAction({
            ready : true,
            context : true,
            action : function () {
                f.call(this, this.vars);
            },
        });
        return this;
    };
    
    this.when = function (v1, v2, f) {
        var f1 = typeof(v1) == 'string'
            ? function (vars) { return lookup(this,v1) }
            : function (vars) { return v1 }
        ;
        var f2 = typeof(v2) == 'string'
            ? function (vars) { return lookup(this,v2) }
            : function (vars) { return v2 }
        ;
        return this.tap(function () {
            if (f1.call(this,this.vars) == f2.call(this,this.vars)) {
                f.call(this, this.vars);
            }
        });
    };
    
    this.unless = function (v1, v2, f) {
        var f1 = typeof(v1) == 'string'
            ? function (vars) { return lookup(this,v1) }
            : function (vars) { return v1 }
        ;
        var f2 = typeof(v2) == 'string'
            ? function (vars) { return lookup(this,v2) }
            : function (vars) { return v2 }
        ;
        return this.tap(function () {
            if (f1.call(this,this.vars) != f2.call(this,this.vars)) {
                f.call(this, this.vars);
            }
        });
    };
    
    this.repeat = function (n, f) {
        var nf = typeof(n) == 'string'
            ? function (vars) { return lookup(this,n) }
            : function (vars) { return n }
        ;
        this.pushAction({
            ready : true,
            context : true,
            action : function () {
                var nn = nf.call(this, this.vars);
                for (var i = 0; i < nn; i++) {
                    f.call(this, this.vars, i);
                }
            },
        });
        return this;
    };
    
    this.forever = function (f) {
        self.foreverfunc = f;
        self.foreveraction = {
            ready : true,
            context : true,
            action : function () {
                self.foreverfunc.call(this, this.vars);
                self.pushAction(self.foreveraction);
            },
        };
        this.pushAction(self.foreveraction);
        return this;
    };
    
    // assign immediately
    function assign (self, key, value) {
        visit(
            self, key instanceof Array ? key : [key],
            function (v,k) { v[k] = value }
        );
    }
    
    function lookup (self) {
        var args = [].slice.call(arguments, 1);
        return visit(self, args, function (v,k) { return v[k] });
    }
    
    function visit(self, args, f) {
        var keys = args.reduce(function (acc,x) {
                return acc.concat(x.split('.'))
            },[])
        ;
        
        var obj = self.vars;
        keys.slice(0,-1).forEach(function (k) {
            if (!obj[k]) obj[k] = {};
            obj = obj[k];
        });
        
        return f(obj, keys.slice(-1)[0]);
    }
    
    // Assign into a variable. All but the last argument make up the key, which
    // may describe a deeply nested address. If the last argument is a:
    // * function - assign the variables from the inner chain
    // * string - assign from the key name
    // * number - assign from this value
    this.into = function () {
        var args = [].concat.apply([],arguments);
        var keys = args.slice(0,-1);
        var fv = args.slice(-1)[0];
        
        return this.tap(function (vars) {
            if (typeof fv == 'function') {
                var topVars = this.vars;
                this.vars = {};
                fv.call(this, this.vars);
                this.pushAction({
                    ready : true,
                    action : function () {
                        var localVars = this.vars;
                        this.vars = topVars;
                        assign(this, keys, localVars);
                    }
                });
            }
            else if (typeof fv == 'string') {
                assign(this, keys, lookup(this,fv));
            }
            else if (typeof fv == 'number') {
                assign(this, keys, fv);
            }
            else {
                throw TypeError(
                    'Last argument to .into must be a string, number, '
                    + 'or a function, not a "' + typeof fv + '".'
                    + 'Value supplied: ' + util.inspect(fv)
                );
            }
        });
    };
    
    function get (opts) {
        var into = [].reduce.call(opts.into, function (acc,x) {
            return acc.concat(x);
        }, []);
        
        this.pushAction({
            ready : function () {
                return buffer.length - this.offset >= opts.bytes;
            },
            action : function () {
                var data = buffer.join(this.offset, this.offset + opts.bytes);
                this.offset += opts.bytes;
                var decodeLittleEndian = opts.signed ? decodeLEs : decodeLE;
                var decodeBigEndian = opts.signed ? decodeBEs : decodeBE;
                assign(this, into,
                    opts.endian && opts.endian == 'little'
                    ? decodeLittleEndian(data)
                    : decodeBigEndian(data)
                );
                
            },
        });
        return this;
    };
    
    this.getWord8 = function () {
        return get.call(
            this, { into : arguments, bytes : 1 }
        );
    };
    
    this.getWord16be = function () {
        return get.call(
            this, { into : arguments, bytes : 2, endian : 'big' }
        );
    };

    this.getWord16bes = function () {
        return get.call(
            this, { into : arguments, bytes : 2, endian : 'big', signed : true }
        );
    }
    
    this.getWord16le = function () {
        return get.call(
            this, { into : arguments, bytes : 2, endian : 'little' }
        );
    };

    this.getWord16les = function () {
        return get.call(
            this, { into : arguments, bytes : 2, endian : 'little',
                signed : true }
        );
    }
    
    this.getWord32be = function () {
        return get.call(
            this, { into : arguments, bytes : 4, endian : 'big' }
        );
    };

    this.getWord32bes = function () {
        return get.call(
            this, { into : arguments, bytes : 4, endian : 'big',
                signed : true }
        );
    };
    
    this.getWord32le = function () {
        return get.call(
            this, { into : arguments, bytes : 4, endian : 'little' }
        );
    };

    this.getWord32les = function () {
        return get.call(
            this, { into : arguments, bytes : 4, endian : 'little',
                signed: true }
        );
    };
    
    this.getWord64be = function () {
        return get.call(
            this, { into : arguments, bytes : 8, endian : 'big' }
        );
    };

    this.getWord64bes = function () {
        return get.call(
            this, { into : arguments, bytes : 8, endian : 'big',
                signed : true }
        );
    };
    
    this.getWord64le = function () {
        return get.call(
            this, { into : arguments, bytes : 8, endian : 'little' }
        );
    };

    this.getWord64les = function () {
        return get.call(
            this, { into : arguments, bytes : 8, endian : 'little',
                signed : true }
        );
    };
    
    this.getBuffer = function () {
        var args = [].concat.apply([],arguments);
        // flatten :into so .getBuffer(['foo','bar','baz'],10)
        // and .getBuffer('foo','bar','baz',10) both work
        var into = args.slice(0,-1).reduce(function f (acc,x) {
            return acc.concat(
                x instanceof Array ? x.reduce(f) : x.split('.')
            );
        }, []);
        var length = args.slice(-1)[0];
        var lengthF;
        
        if (typeof(length) == 'string') {
            var s = length;
            lengthF = function (vars) { return lookup(this,s) };
        }
        else if (typeof(length) == 'number') {
            var s = length;
            lengthF = function (vars) { return s };
        }
        else if (length instanceof Function) {
            lengthF = length;
        }
        else {
            throw TypeError(
                'Last argument to getBuffer (length) must be a string, number, '
                + 'or a function, not a "' + typeof(length) + '".'
                + 'Value supplied: ' + util.inspect(length)
            );
        }
        
        this.pushAction({
            ready : function () {
                var s = lengthF.call(this,this.vars);
                return s && buffer.length - this.offset >= s;
            },
            action : function () {
                var s = lengthF.call(this,this.vars);
                var data = buffer.join(this.offset, this.offset + s);
                this.offset += s;
                assign(this, into, data);
            },
        });
        return this;
    };
}

// convert byte strings to little endian numbers
function decodeLE (bytes) {
    var acc = 0;
    for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256,i) * bytes[i];
    }
    return acc;
}

// convert byte strings to big endian numbers
function decodeBE (bytes) {
    var acc = 0;
    for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
    }
    return acc;
}

// convert byte strings to signed big endian numbers
function decodeBEs (bytes) {
    var val = decodeBE(bytes);
    if ((bytes[0]&0x80) == 0x80) {
        val -= Math.pow(256, bytes.length);
    }
    return val;
}

// convert byte strings to signed little endian numbers
function decodeLEs (bytes) {
    var val = decodeLE(bytes);
    if ((bytes[bytes.length-1]&0x80) == 0x80) {
        val -= Math.pow(256, bytes.length);
    }
    return val;
}

