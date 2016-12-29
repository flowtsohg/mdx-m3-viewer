def arg_exists?(name)
	return ARGV.include? "--#{name}"
end

WANT_SLK = true
WANT_MPQ = true
WANT_PNG = true # PNG / JPG / GIF
WANT_BLP = true
WANT_DDS = true
WANT_TGA = true
WANT_BMP = true
WANT_GEO = true
WANT_W3X = true # Will include SLK, MPQ, MDX, GEO, BLP, TGA, and PNG.
WANT_MDX = true # Will include SLK, BLP, TGA, and PNG.
WANT_M3 = true # Will include DDS, and TGA.
WANT_OBJ = true

WANT_UNIT_TESTER = true
WANT_UNIT_TESTS = arg_exists? "unit-tests"
WANT_STRICT_MODE = true
WANT_MINIFY = true
WANT_GEN_DOCS = arg_exists? "gen-docs" # Assumes you have JSDoc in your PATH system variable.
WANT_SPLIT_EXTERNAL = arg_exists? "split-external" # Split the external code to a separate file - external.min.js

require "json"
BATCHES = JSON.parse File.read "viewer.json"

def batch(name, batch)
	return {
		"name" => name,
		"internal_files" => batch["internal_files"].map { |file| "#{batch["path"]}#{file}.js" },
		"external_files" => batch["external_files"].map { |file| "external/#{file}.js" }
	}
end

def add_batch(name)
    batch name, BATCHES[name]
end

BASE = add_batch "BASE"
PNG = add_batch "PNG"
W3X = add_batch "W3X"
MDX = add_batch "MDX"
BLP = add_batch "BLP"
SLK = add_batch "SLK"
TGA = add_batch "TGA"
BMP = add_batch "BMP"
MPQ = add_batch "MPQ"
M3 = add_batch "M3"
DDS = add_batch "DDS"
GEO = add_batch "GEO"
OBJ = add_batch "OBJ"
UNIT_TESTER = add_batch "UNIT_TESTER"
UNIT_TESTS = add_batch "UNIT_TESTS"

Added = {}
Code = []
External = []

def add(what, is_forced=false)
	if not Added.has_key? what
		Added[what] = true

		print "Adding " + what["name"]
		print " (F)" if is_forced
		puts

		Code.concat what["internal_files"]
		External.concat what["external_files"]
	end
end

def add_forced(what)
	add what, true
end

def minify()
	print "Minifying..."

	File.open("viewer.min.js", "w") { |out|
		out.write "/* #{File.read('LICENSE').strip} */\n"
		out.write "\"use strict\";\n" if WANT_STRICT_MODE

		External.each { |file| out.write File.read file } if not WANT_SPLIT_EXTERNAL
		Code.each { |file| out.write File.read file }
	}

	if WANT_SPLIT_EXTERNAL
		File.open("external.min.js", "w") { |out|
			External.each { |file| out.write File.read file }
		}
	end

	puts "Done"
	puts "> viewer.min.js (#{File.size('viewer.min.js') / 2**10}KB)"
	puts "> external.min.js (#{File.size('external.min.js') / 2**10}KB)" if WANT_SPLIT_EXTERNAL
end

def gen_docs()
	print "Running JSDoc..."

	`jsdoc #{Code.join " "}`

	puts "Done"
end

puts "Hi"

add BASE
add SLK if WANT_SLK
add MPQ if WANT_MPQ
add PNG if WANT_PNG
add BLP if WANT_BLP
add DDS if WANT_DDS
add TGA if WANT_TGA
add BMP if WANT_BMP
add GEO if WANT_GEO

if WANT_W3X
	add_forced SLK if not WANT_SLK
	add_forced MPQ if not WANT_MPQ
	add_forced BLP if not WANT_BLP
	add_forced TGA if not WANT_TGA
	add_forced MDX if not WANT_MDX
	add_forced GEO if not WANT_GEO
	add_forced PNG if not WANT_PNG
	add W3X
end

if WANT_MDX
	add_forced SLK if not WANT_SLK
	add_forced BLP if not WANT_BLP
	add_forced TGA if not WANT_TGA
	add_forced PNG if not WANT_PNG
	add MDX
end

if WANT_M3
	add_forced DDS if not WANT_DDS
	add_forced TGA if not WANT_TGA
	add M3
end

add OBJ if WANT_OBJ

add UNIT_TESTER if WANT_UNIT_TESTER
add UNIT_TESTS if WANT_UNIT_TESTS

minify if WANT_MINIFY
gen_docs if WANT_GEN_DOCS

puts "Bye"
