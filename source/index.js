const prototypePollutionProperties = ['__proto__', 'prototype', 'constructor'];

export default function formFieldsJson(query, options) {
	let root = {};
	let search = new URLSearchParams(query);
	for (let [key, value] of search) {
		set(root, key, value, options);
	}

	return root;
}

export function set(root, key, value, options = {}) {
	let { preventPrototypePollution = true, collisions = 'merge' } = options;

	let props = [];
	let descriptor = key;

	function match(regex) {
		let match = descriptor.match(regex);
		if (match) {
			descriptor = descriptor.slice(match[0].length);

			let name = match[1];
			let array = match[2] === '[]';
			if (preventPrototypePollution && prototypePollutionProperties.includes(name)) {
				throw new Error(`Form fields with name ${name} are not allowed`);
			}

			props.push({ name, array });
		}
	}

	match(/^(\w+)(\[\])?/);
	while (descriptor.length) {
		match(/^\[(\w+)\](\[\])?/);
	}

	let prop;
	while ((prop = props.shift())) {
		let last = props.length === 0;
		let { name, array } = prop;

		let object = root;
		if (object instanceof Array) {
			let element = object[object.length - 1];
			if (element && element[name] == undefined) {
				if (last) {
					element[name] = array ? [value] : value;
				} else {
					element[name] = root = array ? [] : {};
				}
			} else {
				if (last) {
					object.push({ [name]: array ? [value] : value });
				} else {
					object.push({ [name]: (root = array ? [] : {}) });
				}
			}
		} else if (object instanceof Object) {
			let existing = object[name];
			if (existing == undefined) {
				if (last) {
					root = array ? [value] : value;
				} else {
					root = array ? [] : {};
				}
				object[name] = root;
			} else if (existing instanceof Array) {
				if (last) {
					existing.push(value);
				} else {
					root = existing;
				}
			} else if (existing instanceof Object) {
				if (array) {
					root = last ? value : {};

					object[name] = [existing, root];
				} else {
					if (last) {
						if (collisions === 'throw') {
							throw new Error(`Duplicate key ${key}`);
						} else if (collisions === 'replace') {
							object[name] = array ? [value] : value;
						} else {
							object[name] = [existing, value];
						}
					} else {
						root = existing;
					}
				}
			} else {
				if (collisions === 'throw') {
					throw new Error(`Duplicate key ${key}`);
				} else if (collisions === 'replace') {
					if (last) {
						root = array ? [value] : value;
					} else {
						root = array ? [] : {};
					}

					object[name] = root;
				} else {
					root = last ? value : {};

					object[name] = [existing, root];
				}
			}
		}
	}
}
