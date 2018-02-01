function capitaliseFirstLetter(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function htmlEntityDecode(s) {
	return s.replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
}

function htmlEntityEncode(s) {
	return s.replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/&/g, '&amp;');
}

function typeName(o) {
	try {
		return o.constructor.name;
	} catch (e) {
		return typeof o;
	}
}

function basename(path) {
	return path.replace(/\\/g, '/').replace( /.*\//, '' );
}


function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    return bytes;
}

function literalValue(value) {
	let	result = null,
		type = null;
	
	if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
		result = value.substring(1, value.length - 1).replace(/\n/g, '\\n');
		type = 'string';
	} else if (value.length === 6 && value[0] === '\'' && value[5] === '\'') {
		let id = value.substring(1, 5),
			v0 = id.charCodeAt(0) * Math.pow(256, 3),
			v1 = id.charCodeAt(1) * Math.pow(256, 2),
			v2 = id.charCodeAt(2) * Math.pow(256, 1),
			v3 = id.charCodeAt(3) * Math.pow(256, 0);

		result = v0 + v1 + v2 + v3;
		type = 'integer';
	} else if (value.length >= 1 && value[0] === '$') {
		result = parseInt('0x' + value.substring(1));
		type = 'integer';
	} else if (value.length >= 2 && value.substring(0, 2) === '0x') {
		result = parseInt(value);
		type = 'integer';
	} else if (value === 'false') {
		result = false;
		type = 'boolean';
	} else if (value === 'true') {
		result = true;
		type = 'boolean';
	} else if (value === 'null') {
		result = null;
		type = 'nullType';
	} else if (value.indexOf(".") !== -1) {
		result = parseFloat(value);
		type = "real";
	} else {
		result = parseInt(value);
		type = 'integer';
	}

	return {
		value: result,
		type: type
	};
}

module.exports = {
	capitaliseFirstLetter,
	htmlEntityDecode,
	htmlEntityEncode,
	typeName,
	basename,
	literalValue
};
