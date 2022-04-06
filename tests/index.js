import { test } from 'uvu';
import * as assert from 'uvu/assert';

import formFieldsJson from '../source/index.js';

test('a=x', () => {
	let object = formFieldsJson('a=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":"x"}`);
});

test('a[]=x', () => {
	let object = formFieldsJson('a[]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["x"]}`);
});

test('a=x&b=y', () => {
	let object = formFieldsJson('a=x&b=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":"x","b":"y"}`);
});

test('a[]=x&a[]=y', () => {
	let object = formFieldsJson('a[]=x&a[]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["x","y"]}`);
});

test('a[b]=x', () => {
	let object = formFieldsJson('a[b]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":"x"}}`);
});

test('a[b]=x&a[b]=y', () => {
	let object = formFieldsJson('a[b]=x&a[b]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":["x","y"]}}`);
});

test("a[b]=x&a[b]=y, { collisions: 'merge' }", () => {
	let object = formFieldsJson('a[b]=x&a[b]=y', { collisions: 'merge' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":["x","y"]}}`);
});

test("a[b]=x&a[b]=y, { collisions: 'throw' }", () => {
	assert.throws(() => {
		formFieldsJson('a[b]=x&a[b]=y', { collisions: 'throw' });
	});
});

test("a[b]=x&a[b]=y, { collisions: 'replace' }", () => {
	let object = formFieldsJson('a[b]=x&a[b]=y', { collisions: 'replace' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":"y"}}`);
});

test("a=x&a[]=y, { collisions: 'merge' }", () => {
	let object = formFieldsJson('a=x&a[]=y', { collisions: 'merge' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["x","y"]}`);
});

test("a=x&a[]=y, { collisions: 'replace' }", () => {
	let object = formFieldsJson('a=x&a[]=y', { collisions: 'replace' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["y"]}`);
});

test("a=x&a[]=y, { collisions: 'throw' }", () => {
	assert.throws(() => {
		formFieldsJson('a=x&a[]=y', { collisions: 'throw' });
	});
});

test('a[]=x&a=y', () => {
	let object = formFieldsJson('a[]=x&a=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["x","y"]}`);
});

test('a[b][c]=x', () => {
	let object = formFieldsJson('a[b][c]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":{"c":"x"}}}`);
});

test('a[b]=x&a[c]=y', () => {
	let object = formFieldsJson('a[b]=x&a[c]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":"x","c":"y"}}`);
});

test('a[]=x', () => {
	let object = formFieldsJson('a[]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":["x"]}`);
});

test('a[][b]=x', () => {
	let object = formFieldsJson('a[][b]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x"}]}`);
});

test('a[][b][c]=x', () => {
	let object = formFieldsJson('a[][b][c]=x');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":{"c":"x"}}]}`);
});

test('a[][b]=x&a[][b]=y', () => {
	let object = formFieldsJson('a[][b]=x&a[][b]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x"},{"b":"y"}]}`);
});

test('a[][b]=x&a[][c]=y', () => {
	let object = formFieldsJson('a[][b]=x&a[][c]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x","c":"y"}]}`);
});

test('a[b]=x&a[b]=y&a[b]=z', () => {
	let object = formFieldsJson('a[b]=x&a[b]=y&a[b]=z');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":["x","y","z"]}}`);
});

test('a[b]=x&a[b][c]=y', () => {
	let object = formFieldsJson('a[b]=x&a[b][c]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":{"b":["x",{"c":"y"}]}}`);
});

test('a[b]=x&a[]=y', () => {
	let object = formFieldsJson('a[b]=x&a[]=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x"},"y"]}`);
});

test('a[b]=x&a=y', () => {
	let object = formFieldsJson('a[b]=x&a=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x"},"y"]}`);
});

test('a[b]=x&a=y, { collisions: merge }', () => {
	let object = formFieldsJson('a[b]=x&a=y', { collisions: 'merge' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":"x"},"y"]}`);
});

test('a[b]=x&a=y, { collisions: throw }', () => {
	assert.throws(() => {
		formFieldsJson('a[b]=x&a=y', { collisions: 'throw' });
	});
});

test('a[b]=x&a=y, { collisions: replace }', () => {
	let object = formFieldsJson('a[b]=x&a=y', { collisions: 'replace' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":"y"}`);
});

test('a[b][]=x&a=y', () => {
	let object = formFieldsJson('a[b][]=x&a=y');
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":["x"]},"y"]}`);
});

test('a[b][]=x&a=y, { collisions: merge }', () => {
	let object = formFieldsJson('a[b][]=x&a=y', { collisions: 'merge' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":[{"b":["x"]},"y"]}`);
});

test('a[b][]=x&a=y, { collisions: replace }', () => {
	let object = formFieldsJson('a[b][]=x&a=y', { collisions: 'replace' });
	let objectJson = JSON.stringify(object);

	assert.snapshot(objectJson, `{"a":"y"}`);
});

test('a[b][]=x&a=y, { collisions: throw }', () => {
	assert.throws(() => {
		formFieldsJson('a[b][]=x&a=y', { collisions: 'throw' });
	});
});

test.run();
