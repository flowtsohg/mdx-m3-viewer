WANT_NATIVE = true # PNG / JPG / GIF
WANT_W3X = true # Will include SLK, MPQ, MDX, GEO, BLP, and TGA.
WANT_MPQ = true
WANT_MDX = true # Will include SLK, BLP, and TGA.
WANT_SLK = true
WANT_BLP = true
WANT_TGA = true
WANT_M3 = true # Will include DDS, and TGA.
WANT_DDS = true
WANT_GEO = true

WANT_MINIFY = true
WANT_GEN_DOCS = false # Assumes you have JSDoc in your PATH system variable.

Files = [
    "src/common.js",
	"src/binaryreader.js",
    "src/bitbuffer.js",
	"external/gl-matrix-min.js",
    "src/math/gl-matrix-addon.js",
    "src/math/interpolator.js",
    "src/math/math.js",
    "src/actionqueue.js",
    "src/eventdispatcher.js",
    "src/node.js",
    "src/boundingshape.js",
    "src/asyncresource.js",
    "src/downloadableresource.js",
    "src/skeleton.js",
    "src/gl/resizeablebuffer.js",
    "src/gl/shader.js",
    "src/gl/gl.js",
    "src/frustum.js",
    "src/camera.js",
    "src/handler.js",
    "src/modelhandler.js",
    "src/texturehandler.js",
    "src/filehandler.js",
    "src/model.js",
    "src/modelview.js",
    "src/modelinstance.js",
    "src/texture.js",
    "src/genericfile.js",
    "src/bucket.js",
    "src/viewer.js"
]

NATIVE = {
	"name" => "NATIVE",
	"files" => [
		"src/nativetexture/texture.js",
		"src/nativetexture/handler.js"
	]
}

W3X = {
	"name" => "W3X",
	"files" => [
		"handlers/w3x/objects.js",
		"handlers/w3x/map.js",
		"handlers/w3x/handler.js"
	]
}

MDX = {
	"name" => "MDX",
	"files" => [
		"handlers/mdx/shaders.js",
		"handlers/mdx/parser.js",
		"handlers/mdx/sd.js",
		"handlers/mdx/skeleton.js",
		"handlers/mdx/collisionshape.js",
		"handlers/mdx/camera.js",
		"handlers/mdx/texture.js",
		"handlers/mdx/geoset.js",
		"handlers/mdx/layer.js",
		"handlers/mdx/geosetanimation.js",
		"handlers/mdx/textureanimation.js",
		"handlers/mdx/node.js",
		"handlers/mdx/attachment.js",
		"handlers/mdx/eventobjectspn.js",
		"handlers/mdx/eventobjectspl.js",
		"handlers/mdx/eventobjectubr.js",
		"handlers/mdx/eventobjectemitter.js",
		"handlers/mdx/particle.js",
		"handlers/mdx/particleemitter.js",
		"handlers/mdx/particle2.js",
		"handlers/mdx/particleemitter2.js",
		"handlers/mdx/particleemitter2view.js",
		"handlers/mdx/ribbon.js",
		"handlers/mdx/ribbonemitter.js",
		"handlers/mdx/ribbonemitterview.js",
		"handlers/mdx/bucket.js",
		"handlers/mdx/modelview.js",
		"handlers/mdx/model.js",
		"handlers/mdx/modelinstance.js",
		"handlers/mdx/handler.js"
	]
}

BLP = {
	"name" => "BLP",
	"files" => [
		"external/jpg.js",
		"handlers/blp/texture.js",
		"handlers/blp/handler.js"
	]
}

SLK = {
	"name" => "SLK",
	"files" => [
		"handlers/slk/file.js",
		"handlers/slk/handler.js"
	]
}

MPQ = {
	"name" => "MPQ",
	"files" => [
		"external/inflate.min.js",
		"handlers/mpq/crypto.js",
		"handlers/mpq/hashtable.js",
		"handlers/mpq/blocktable.js",
		"handlers/mpq/file.js",
		"handlers/mpq/archive.js",
		"handlers/mpq/handler.js"
	]
}

TGA = {
	"name" => "TGA",
	"files" => [
		"handlers/tga/texture.js",
		"handlers/tga/handler.js"
	]
}

M3 = {
	"name" => "M3",
	"files" => [
		"handlers/m3/shaders.js",
		"handlers/m3/parser.js",
		"handlers/m3/sd.js",
		"handlers/m3/sts.js",
		"handlers/m3/stc.js",
		"handlers/m3/stg.js",
		"handlers/m3/skeleton.js",
		"handlers/m3/boundingshape.js",
		"handlers/m3/region.js",
		"handlers/m3/layer.js",
		"handlers/m3/standardmaterial.js",
		"handlers/m3/particle.js",
		"handlers/m3/particleemitter.js",
		"handlers/m3/bucket.js",
		#"handlers/m3/modelview.js",
		"handlers/m3/model.js",
		"handlers/m3/modelinstance.js",
		"handlers/m3/handler.js"
	]
}

DDS = {
	"name" => "DDS",
	"files" => [
		"handlers/dds/dxt.js",
		"handlers/dds/texture.js",
		"handlers/dds/handler.js"
	]
}

GEO = {
	"name" => "GEO",
	"files" => [
		"handlers/geometry/geometry.js",
		"handlers/geometry/model.js",
		"handlers/geometry/modelinstance.js",
		"handlers/geometry/bucket.js",
		"handlers/geometry/handler.js"
	]
}

Added = {}

def add(what, is_forced=false)
	if not Added.has_key? what
		Added[what] = true

		print "Adding " + what["name"]
		print " (F)" if is_forced
		puts

		Files.concat what["files"]
	end
end

def add_forced(what)
	add what, true
end

puts "Hi"

if WANT_W3X
	add W3X
	add_forced SLK if not WANT_SLK
	add_forced MPQ if not WANT_MPQ
	add_forced MDX if not WANT_MDX
	add_forced GEO if not WANT_GEO
	add_forced BLP if not WANT_BLP
	add_forced TGA if not WANT_TGA
end

if WANT_MDX
	add MDX
	add_forced SLK if not WANT_SLK
	add_forced BLP if not WANT_BLP
	add_forced TGA if not WANT_TGA
end

if WANT_M3
	add M3
	add_forced DDS if not WANT_DDS
	add_forced TGA if not WANT_TGA
end

add NATIVE if WANT_NATIVE
add BLP if WANT_BLP
add SLK if WANT_SLK
add MPQ if WANT_MPQ
add TGA if WANT_TGA
add DDS if WANT_DDS
add GEO if WANT_GEO

if WANT_MINIFY
	print "Minifying..."

	File.open("viewer.min.js", "w") { |out|
		out.write "/* #{File.read('LICENSE').strip} */\n"

		Files.each { |file|
			out.write File.read file
		}
	}

	puts "Done (#{File.size('viewer.min.js') / 2**10}KB)"
end

if WANT_GEN_DOCS
	print "Running JSDoc..."

	`jsdoc #{Files.join " "}`

	puts "Done"
end

puts "Bye"
