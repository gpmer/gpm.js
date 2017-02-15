/**
 * Created by axetroy on 17-2-15.
 */
const test = require('ava');
const coffee = require('coffee');

test('should concat input', (t) => {
  coffee.spawn('cat')
    .write('1')
    .write('2')
    .expect('stdout', '12')
    .expect('code', 0)
    .end(() => t.pass());
});