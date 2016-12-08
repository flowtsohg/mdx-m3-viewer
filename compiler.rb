WANT_SLK = true
WANT_MPQ = true
WANT_PNG = true # PNG / JPG / GIF
WANT_BLP = true
WANT_DDS = true
WANT_TGA = true
WANT_GEO = true
WANT_W3X = true # Will include SLK, MPQ, MDX, GEO, BLP, TGA, and PNG.
WANT_MDX = true # Will include SLK, BLP, TGA, and PNG.
WANT_M3 = true # Will include DDS, and TGA.

WANT_STRICT_MODE = true

WANT_MINIFY = true
WANT_GEN_DOCS = false # Assumes you have JSDoc in your PATH system variable.

def batch(name, base_path, files, externals=[])
	return {
		"name" => name,
		"files" => files.map { |file| "#{base_path}#{file}.js" },
		"external_files" => externals.map { |file| "external/#{file}.js" }
	}
end

BASE = batch "BASE",
			"src/",
			[
				"common",
				"binaryreader",
				"bitbuffer",
				"math/gl-matrix-addon",
				"math/interpolator",
				"math/math",
				"actionqueue",
				"eventdispatcher",
				"node",
				"boundingshape",
				"asyncresource",
				"downloadableresource",
				"skeleton",
				"gl/resizeablebuffer",
				"gl/shader",
				"gl/gl",
				"frustum",
				"camera",
				"handler",
				"modelhandler",
				"texturehandler",
				"filehandler",
				"model",
				"modelview",
				"modelinstance",
				"texture",
				"genericfile",
				"bucket",
				"scene",
				"viewer"
			],
			[
				"gl-matrix/common",
				"gl-matrix/vec2",
				"gl-matrix/vec3",
				"gl-matrix/vec4",
				"gl-matrix/mat2",
				"gl-matrix/mat2d",
				"gl-matrix/mat3",
				"gl-matrix/mat4",
				"gl-matrix/quat"
			]

PNG = batch "PNG",
			"handlers/nativetexture/",
			[
				"texture",
				"handler"
			]

W3X = batch "W3X",
			"handlers/w3x/",
			[
				"objects",
				"map",
				"handler"
			]

MDX = batch "MDX",
			"handlers/mdx/",
			[
				"shaders",
				"parser",
				"sd",
				"skeleton",
				"collisionshape",
				"camera",
				"geoset",
				"layer",
				"geosetanimation",
				"textureanimation",
				"node",
				"attachment",
				"eventobjectspn",
				"eventobjectspl",
				"eventobjectubr",
				"eventobjectemitter",
				"particle",
				"particleemitter",
				"particle2",
				"particleemitter2",
				"particleemitter2view",
				"ribbon",
				"ribbonemitter",
				"ribbonemitterview",
				"bucket",
				"modelview",
				"model",
				"modelinstance",
				"handler"
			]

BLP = batch "BLP",
			"handlers/blp/",
			[
				"texture",
				"handler"
			],
			[
				"jpg"
			]

SLK = batch "SLK",
			"handlers/slk/",
			[
				"line",
				"file",
				"handler"
			]

MPQ = batch "MPQ",
			"handlers/mpq/",
			[
				"crypto",
				"hashtable",
				"blocktable",
				"file",
				"archive",
				"handler"
			],
			[
				"inflate.min"
			]

TGA = batch "TGA",
			"handlers/tga/",
			[
				"texture",
				"handler"
			]

M3 = batch "M3",
			"handlers/m3/",
			[
				"shaders",
				"parser",
				"sd",
				"sts",
				"stc",
				"stg",
				"skeleton",
				"boundingshape",
				"region",
				"layer",
				"standardmaterial",
				#"particle",
				#"particleemitter",
				"bucket",
				"modelview",
				"model",
				"modelinstance",
				"handler"
			]

DDS = batch "DDS",
			"handlers/dds/",
			[
				"dxt",
				"texture",
				"handler"
			]

GEO = batch "GEO",
			"handlers/geo/",
			[
				"geometry",
				"modelview",
				"model",
				"modelinstance",
				"bucket",
				"handler"
			]

Added = {}
Code = []
External = []

def add(what, is_forced=false)
	if not Added.has_key? what
		Added[what] = true

		print "Adding " + what["name"]
		print " (F)" if is_forced
		puts

		Code.concat what["files"]
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

		External.each { |file| out.write File.read file }
		Code.each { |file| out.write File.read file }
	}

	puts "Done (#{File.size('viewer.min.js') / 2**10}KB)"
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

minify if WANT_MINIFY
gen_docs if WANT_GEN_DOCS

puts "Bye"
