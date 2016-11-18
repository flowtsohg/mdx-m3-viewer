WANT_W3X = true # Will include MPQ, MDX, SLK, BLP, and TGA.
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
    "src/viewer.js",
	"src/nativetexture/texture.js",
    "src/nativetexture/handler.js"
]
 
puts "Hi"

if WANT_W3X
	puts "Adding W3X"

	Files.concat [
		"handlers/w3x/objects.js",
		"handlers/w3x/map.js",
		"handlers/w3x/handler.js"
	]
end

if WANT_MDX or WANT_W3X
	puts "Adding MDX"

	Files.concat [
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
end

if WANT_BLP or WANT_MDX or WANT_W3X
	puts "Adding BLP"

	Files.concat [
		"external/jpg.js",
		"handlers/blp/texture.js",
		"handlers/blp/handler.js"
	]
end

if WANT_SLK or WANT_MDX or WANT_W3X
	puts "Adding SLK"

	Files.concat [
		"handlers/slk/file.js",
		"handlers/slk/handler.js"
	]
end

if WANT_MPQ or WANT_W3X
	puts "Adding MPQ"

	Files.concat [
		"external/inflate.min.js",
		"handlers/mpq/crypto.js",
		"handlers/mpq/hashtable.js",
		"handlers/mpq/blocktable.js",
		"handlers/mpq/file.js",
		"handlers/mpq/archive.js",
		"handlers/mpq/handler.js"
	]
end

if WANT_TGA or WANT_MDX or WANT_W3X or WANT_M3
	puts "Adding TGA"

	Files.concat [
		"handlers/tga/texture.js",
		"handlers/tga/handler.js"
	]
end

if WANT_M3
	puts "Adding M3"

	Files.concat [
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
end

if WANT_DDS or WANT_M3
	puts "Adding DDS"

	Files.concat [
		"handlers/dds/dxt.js",
		"handlers/dds/texture.js",
		"handlers/dds/handler.js"
	]
end

if WANT_GEO
	puts "Adding GEO"

	Files.concat [
		"handlers/geometry/geometry.js",
		"handlers/geometry/model.js",
		"handlers/geometry/modelinstance.js",
		"handlers/geometry/bucket.js",
		"handlers/geometry/handler.js"
	]
end

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
