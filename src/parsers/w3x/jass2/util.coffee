# Written by https://github.com/Ralle
capitaliseFirstLetter = (s) ->
    s.charAt(0).toUpperCase() + s.slice(1)

htmlEntityDecode = (s) ->
	s.replace(/&quot;/g, '"')
	 .replace(/&gt;/g, '>')
	 .replace(/&lt;/g, '<')
	 .replace(/&amp;/g, '&')

htmlEntityEncode = (s) ->
	s.replace(/"/g, '&quot;')
	 .replace(/>/g, '&gt;')
	 .replace(/</g, '&lt;')
	 .replace(/&/g, '&amp;')

typeName = (o) ->
	try
		return o.constructor.name
	catch e
		return typeof o

basename = (path) ->
    path.replace(/\\/g, '/').replace( /.*\//, '' )

literalValue = (value) ->
	result = null
	type = null
	if value.length >= 2 and value[0] == '"' and value[ value.length - 1] == '"'
		# this is a string
		# strip the quote symbols
		result = value.substring 1, value.length - 1
		type = 'string'

	else if value.length == 6 and value[0] == '\'' and value[5] == '\''
		# this is a 4 character integer
		value = value.substring 1, 5
		v0 = value.charCodeAt(0) * Math.pow 256, 3
		v1 = value.charCodeAt(1) * Math.pow 256, 2
		v2 = value.charCodeAt(2) * Math.pow 256, 1
		v3 = value.charCodeAt(3) * Math.pow 256, 0
		result = v0 + v1 + v2 + v3
		type = 'integer'

	else if value.length >= 1 and value[0] == '$'
		# this is a $-prefixed hex value
		result = parseInt '0x' + value.substring 1
		type = 'integer'

	else if value.length >= 2 and value.substring 0, 2 == '0x'
		# this is a 0x-prefixed hex value
		result = parseInt value
		type = 'integer'

	else if value == 'false'
		result = false
		type = 'boolean'

	else if value == 'true'
		result = true
		type = 'boolean'

	else if value == 'null'
		result = null
		type = 'nullType'

	else
		# this is an integer
		result = parseInt value
		type = 'integer'
	return {
		value: result
		type: type
	}

module.exports = {
	capitaliseFirstLetter
	htmlEntityDecode
	htmlEntityEncode
	typeName
	basename
	literalValue
}