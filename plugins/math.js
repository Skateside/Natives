/**
 * A plugin to add the Math methods onto the number wrapper.
 */
(function () {

    'use strict';

        /**
         * @type {Object} extension Used to extend N.
         */
    var extension = {};

    /**
     * Rounds a number to a given precision using a given method. If the method
     * is not defined, "round" is assumed.
     * 
     * @param {number} number Number to round.
     * @param {number} precision Precision to which the number should be
     * rounded.
     * @param {string} method Rounding method to use.
     * @return {number} Rounded number.
     */
    function round(number, precision, method) {

        var coefficient = Math.pow(10, Math.abs(+precision || 0)),
            process     = (typeof method === 'string' &&
                        typeof Math[method] === 'function') ?
                    method :
                    'round';

        return Math[process](number * coefficient) / coefficient;

    }

    /**
     * The "ceil", "floor" and "round" methods should allow for precision to be
     * defined.
     */
    [
        'ceil',
        'floor',
        'round'
    ].forEach(function (method) {

        extension[method] = function (precision) {
            return this.init(round(this.value, precision, method));
        };

    });

    /**
     * Add on any Math method that would return a number.
     */
    [
        'abs',
        'acos',
        'asin',
        'atan',
        'cbrt',
        'cos',
        'exp',
        'imul',
        'log',
        'pow',
        'sin',
        'sqrt',
        'tan'
    ].forEach(function (method) {

        extension[method] = function () {

            var args = [this.value];

            Array.prototype.push.apply(args, arguments);

            return this.init(Math[method].apply(Math, args));

        };

    });

    N.extend(extension);

}());