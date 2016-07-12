var moment = require('moment');
var now = moment();

// console.log(now.format()); //basic timestamp
// console.log(now.format('X')); // uppercase x = represents seconds since jan.1 1970 - linux/unix timestamp
// //xconsole.log(now.format('x')); //lowercase x = represents milliseconds since jan.1 1970 - javascript timestamp
// console.log(now.valueOf());

var timestamp = 1468353430466;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('HH:MMa'));

// now.subtract(1, 'year');
// console.log(now.format()); 

// console.log(now.format('MMM Do YYYY, h:mma')); 