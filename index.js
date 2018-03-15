var lvl = 0,
    canColor = false,
    asJson = false,
    errorAsJson = false,
    colors = {
        info  : '\x1b[36m',
        warn  : '\x1b[33m',
        error : '\x1b[31m'
    },
    levels = {
        log   : 0,
        trace : 5,
        debug : 10,
        info  : 20,
        warn  : 30,
        error : 40
    };

module.exports = {
    LEVEL_ALL   : 0,
    LEVEL_TRACE : 5,
    LEVEL_DEBUG : 10,
    LEVEL_INFO  : 20,
    LEVEL_WARN  : 30,
    LEVEL_ERROR : 40,
    LEVEL_OFF   : 1000,

    setLevel : function(l) {
        l = parseInt(l);

        if (l) {
            lvl = l;
        }
    },

    setAsJson: function(b, eb) {
        asJson = !!b;
        errorAsJson = (typeof eb === 'boolean') ? eb : !!b;
    },

    canColor : function(b) {
        canColor = !!b;
    },

    log :  function() {
        log('LOG', 'log', arguments);
    },

    trace : function() {
        log('TRACE', 'trace', arguments);
    },

    debug : function() {
        log('DEBUG', 'log', arguments);
    },

    info : function() {
        log('INFO', 'info', arguments);
    },

    warn : function() {
        log('WARN', 'warn', arguments);
    },

    error : function() {
        log('ERROR', 'error', arguments);
    }
};

function log(type, f, args) {
    if ((typeof levels[f] !== 'undefined') && (lvl <= levels[f])) {
        var now = new Date(), data;

        if ((asJson) && ((errorAsJson) || (type !== 'ERROR'))) {
            data = {
                type: type,
                datetime: getDateTime(now)
            };

            if ((args) && (args.length)) {
                data.data = args[0];

                if (args.length > 1) {
                    data.args = [];
                    for (var i = 1; i < args.length; i++) {
                        data.args.push(args[i]);
                    }
                }
            }

            if (type === 'ERROR') {
                data.filename = getFilename();
            }

            data.date = getDate(now);
            data.time = getTime(now);
            data.ts = now.getTime();

            data = JSON.stringify(data);
            if ((canColor) && (colors[f])) {
                data = colors[f] + data + '\x1b[0m';
            }

            console[f].apply(console, [data]);
        } else {
            data = [];
            data.push(getDateTime(now));
            data.push(type);

            if (type === 'ERROR') {
                data.push(getFilename());
            }

            if ((args) && (args.length)) {
                for (var i = 0; i < args.length; i++) {
                    data.push(args[i]);
                }
            }

            if ((canColor) && (colors[f])) {
                data[0] = colors[f] + data[0];
                data.push('\x1b[0m');
            }

            console[f].apply(console, data);
        }
    }
}

function getDateTime(now) {
    return getDate(now) + ' ' + getTime(now);
}

function getDate(now) {
    return [now.getFullYear(), tz(now.getMonth() + 1), tz(now.getDate())].join('-');
}

function getTime(now) {
    return [tz(now.getHours()), tz(now.getMinutes()), tz(now.getSeconds())].join(':');
}

function getFilename() {
    try {
        a += 0;
    } catch (e) {
        var stack = e.stack.split("\n");
        for(var i = 2; i < stack.length; i++) {
            if (stack[i].indexOf(__filename) < 0) {
                return stack[i];
            }
        }
    }

    return '';
}

function tz(i) {
    if (i < 10) {
        return '0' + i;
    }

    return i;
}