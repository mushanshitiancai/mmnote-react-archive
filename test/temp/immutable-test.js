const {Map, fromJS, Record} = require('immutable');
var Cursor = require('immutable/contrib/cursor');

/*
let a = fromJS({
    docs: {
        url: 'a',
        data: 'a data'
    }
})

let log = console.log;

log(a);
log(a.get('docs'));
log(a.get('docs').set('url', 'fuck'))

let R = Record({
    docs: Record({
        url: 'a',
        data: 'a data'
    })
});

let r = R();
log(r)
log(r.docs)
*/

// cursor

/*
var data = fromJS({ a: { b: { c: 1, d: { e: 2 } } } });
var nData;
var cursor = Cursor.from(data, ['a', 'b'], newData => {
    nData = newData;
});

// ... elsewhere ...

log(cursor.get('c')); // 1
cursor = cursor.update('c', x => x + 1);
log(cursor.get('c')); // 2

log(cursor.get('c')); // 1
cursor = cursor.update('c', x => x + 1);
log(cursor.get('c')); // 2

// ... back to data ...

log(data.getIn(['a', 'b', 'c'])); // 2
log(nData.getIn(['a', 'b', 'c'])); // 2
log(nData === data);
*/