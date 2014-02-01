/**
 * A series of useful add ons to the wrappers. This mainly exists to show the
 * real power of this library.
 */

O.extend({

    each: function (fn) {

        var obj  = this.value,
            prop = '',
            owns = Object.prototype.hasOwnProperty.bind(obj);

        for (prop in obj) {
            if (owns(prop)) {

                fn.call(null, obj[prop], prop, obj);

            }
        }

        return this.init(obj);

    },

    extend: function (obj) {
        return this.init(NATIVE.extendObject({}, this.value, obj));
    }

});

A.extend({

    coerce: function (value) {

        var coerced = [value];

        if (A.isArray(value)) {
            coerced = value;
        } else if (A.isArrayLike(value)) {
            coerced = A.toArray(value);
        }

        return coerced;

    },

    unique: function () {

        return this.init(this.value.reduce(function(p, c) {
    
            if (p.indexOf(c) < 0) {
                p.push(c);
            }

            return p;

        }, []));

    },

    columnise: function (size) {

        var columns = [],
            column  = [];

        this.forEach(function (entry) {

            if (column.push(entry) >= size) {

                columns.push(column);
                column = [];

            }

        });

        if (column.length) {
            columns.push(column);
        }

        return this.init(columns);

    }

});

NATIVE.extendObject(A, {

    toArray: function (value) {

        return Array.prototype.slice.call(value);

    },

    isArrayLike: function (value) {

        return typeof value.length === 'number';

    }

});

S.extend({

    supplant: function (map) {

        return this.init(this.value.replace(/\{(\w+)\}/g, function ($0, $1) {

            var replace = map[$1];

            return typeof replace === 'string' || typeof replace === 'number' ?
                    replace :
                    $0;

        }));

    },

    makeHTML: function () {

        var div = document.createElement('div');

        div.innerHTML = this.value;

        return div.firstElementChild;

    }

});