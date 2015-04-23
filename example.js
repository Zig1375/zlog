var zlog = require('./');

zlog.canColor(true);
console.time('time');
for(var i = 0; i < 100000; i++) {
   // zlog.log("Test LOG");

}
console.timeEnd('time');
zlog.debug("Test DEBUG");


zlog.info("Test INFO");
zlog.warn("Test WARN");

zlog.error("Test ERROR");
zlog.trace("Test TRACE");
