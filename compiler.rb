# Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

require "./glsl_min"

USE_CLOSURE = true
MIN_SHADERS = true

MDX_SHADERS = [
  "vssoftskinning",
  "vshardskinningarray",
  "vshardskinningtexture",
  "vsparticles",
  "psmain",
  "psparticles"
]

M3_SHADERS = [
  "vscommon",
  "vsstandard",
  "pscommon",
  "psstandard",
  "psspecialized"
]

SHARED_SHADERS = [
  "vsbonetexture",
  "vsworld",
  "vswhite",
  "psworld",
  "pswhite"
]

CODE_FILES = [
  "math/before",
  "math/math",
  "math/vec3",
  "math/vec4",
  "math/quaternion",
  "math/mat4",
  "math/interpolator",
  "math/after",
  "binaryreader/binaryreader",
	"base",
  "gl",
  "url",
  "viewer/before",
  "viewer/shaders",
  "viewer/mdx/before",
	"viewer/mdx/parser",
  "viewer/mdx/tracks",
  "viewer/mdx/skeleton",
  "viewer/mdx/collisionshape",
	"viewer/mdx/model",
	"viewer/mdx/texture",
	"viewer/mdx/geoset",
	"viewer/mdx/layer",
  "viewer/mdx/particle",
  "viewer/mdx/particleemitter",
  "viewer/mdx/particle2",
  "viewer/mdx/particleemitter2",
  "viewer/mdx/ribbon",
  "viewer/mdx/ribbonemitter",
  "viewer/mdx/after",
  "viewer/m3/before",
  "viewer/m3/parser",
  "viewer/m3/sd",
  "viewer/m3/sts",
  "viewer/m3/stc",
  "viewer/m3/stg",
  "viewer/m3/skeleton",
  "viewer/m3/boundingshape",
  "viewer/m3/region",
  "viewer/m3/layer",
  "viewer/m3/standardmaterial",
  "viewer/m3/model",
  "viewer/m3/after",
  "viewer/after"
]

File.open("src/viewer/shaders.js", "w") { |output|
  output.write("// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)\n\n")
  
  output.write("var SHADERS = {\n\t")
  
  if MIN_SHADERS
    shaders = SHARED_SHADERS.collect { |k| "\"#{k}\":\"#{glsl_min_file("src/viewer/sharedshaders/#{k}.c")}\"" }
    shaders.concat(MDX_SHADERS.collect { |k| "\"w#{k}\":\"#{glsl_min_file("src/viewer/mdx/shaders/#{k}.c")}\"" })
    shaders.concat(M3_SHADERS.collect { |k| "\"s#{k}\":\"#{glsl_min_file("src/viewer/m3/shaders/#{k}.c")}\"" })
  else
    shaders = SHARED_SHADERS.collect { |k| "\"#{k}\":\"#{IO.read("src/viewer/sharedshaders/#{k}.c").gsub("\n", "\\\\n")}\"" }
    shaders.concat(MDX_SHADERS.collect { |k| "\"w#{k}\":\"#{IO.read("src/viewer/mdx/shaders/#{k}.c").gsub("\n", "\\\\n")}\"" })
    shaders.concat(M3_SHADERS.collect { |k| "\"s#{k}\":\"#{IO.read("src/viewer/m3/shaders/#{k}.c").gsub("\n", "\\\\n")}\"" })
  end
  
  output.write(shaders.join(",\n\t"))
  output.write("\n};")
}

File.open("model_viewer_monolith.js", "w") { |output|
  output.write("(function(){")
  output.write("\"use strict\";")
  
  CODE_FILES.each { |file|
		output.write(IO.read("src/" + file + ".js") + "\n")
	}
  
  output.write("}());")
}

if USE_CLOSURE
  system("java -jar compiler.jar --js model_viewer_monolith.js --js_output_file model_viewer_monolith_min.js");
else
  File.open("model_viewer_monolith_min.js", "w") { |output|
    File.open("model_viewer_monolith.js", "r") { |input|
      output.write(input.read())
    }
  }
end

File.open("model_viewer_monolith_min.js", "r") { |input|
  File.open("viewer.js", "w") { |output|
    output.write("// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)\n")
    
    if USE_CLOSURE
      output.write("(function(){")
      output.write("\"use strict\";")
    end
    
    output.write(input.read().gsub("// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)", ""))
    
    if USE_CLOSURE
      output.write("}());")
    end
    
  }
}

File.delete("model_viewer_monolith.js")
File.delete("model_viewer_monolith_min.js")