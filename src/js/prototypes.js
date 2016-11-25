/**
 * prototypes
 */

/* Format timestamps */
Number.prototype.toMinutes = function () {
  var min = Math.floor((Date.now() - this) / 60000)
  return min == 0 ? 'Nå' : min + ' min siden';
}
