output_path = "viewer.js"
use_closure = true
use_glsl_min = true

# Check for the existence of the Closure compiler
# https://developers.google.com/closure/compiler/
if use_closure and not File.file?("compiler.jar")
  use_closure = false
end

# Check for the existence of glsl_min
# https://github.com/flowtsohg/glsl-minifier
if use_glsl_min
  begin
    require_relative "glsl_min"
  rescue LoadError
    use_glsl_min = false
  end
end

mdx_shaders = [
  "vsmain",
  "vsribbons",
  "vsparticles",
  "vscolor",
  "psmain",
  "psparticles"
]

m3_shaders = [
  "vscommon",
  "vsstandard",
  "vscolor",
  "pscommon",
  "psstandard",
  "psspecialized",
  "vsparticles",
  "psparticles"
]

shared_shaders = [
  "vsbonetexture",
  "decodefloat",
  "vsworld",
  "vswhite",
  "psworld",
  "pswhite",
  "pscolor"
]

code_files = [
  "math/gl-matrix",
  "math/gl-matrix-addon",
  "math/math",
  "math/interpolator",
  "binaryreader/binaryreader",
  "base",
  "gl/before",
  "gl/shader",
  "gl/jpg",
  "gl/texture",
  "gl/blptexture",
  "gl/ddstexture",
  "gl/tgatexture",
  "gl/rect",
  "gl/cube",
  "gl/sphere",
  "gl/cylinder",
  "gl/gl",
  "gl/after",
  "viewer/before",
  "viewer/shaders",
  "viewer/mdx/before",
  "viewer/mdx/parser",
  "viewer/mdx/sd",
  "viewer/mdx/skeleton",
  "viewer/mdx/collisionshape",
  "viewer/mdx/model",
  "viewer/mdx/modelinstance",
  "viewer/mdx/texture",
  "viewer/mdx/geoset",
  "viewer/mdx/layer",
  "viewer/mdx/geosetanimation",
  "viewer/mdx/textureanimation",
  "viewer/mdx/node",
  "viewer/mdx/attachment",
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
  "viewer/m3/modelinstance",
  #"viewer/m3/particle",
  #"viewer/m3/particleemitter",
  "viewer/m3/after",
  "viewer/model",
  "viewer/modelinstance",
  "viewer/after"
]

def handle_shaders(use_glsl_min, shared, mdx, m3, srcpath)
  names = shared + mdx.map { |p| "w" + p } + m3.map { |p| "s" + p }
  paths = shared.map { |p| srcpath + "sharedshaders/" + p + ".c" } + mdx.map { |p| srcpath + "mdx/shaders/" + p + ".c" } + m3.map { |p| srcpath + "m3/shaders/" + p + ".c" }
  shaders = []
  
  if use_glsl_min
    minified = minify_files(paths , false)
    
    names.each_index { |i|
      shaders.push("\"#{names[i]}\":\"#{minified[0][i]}\"")
    }
  else
    names.each_index { |i|
      shaders.push("\"#{names[i]}\":\"#{IO.read(paths[i]).gsub("\r\n", "\\n")}\"")
    }
  end
  
  File.open(srcpath + "shaders.js", "w") { |out|
    out.write("var SHADERS = {\n\t#{shaders.join(",\n\t")}\n};")
  }
end

def handle_source(use_closure, paths, output)
    File.open("model_viewer_monolith.js", "w") { |output|
      output.write("(function () {\n")
      output.write("\"use strict\";\n")
      
      paths.each { |file|
        output.write("\n")
        output.write(IO.read("src/" + file + ".js"))
        output.write("\n")
      }
      
      output.write("}());")
    }
	
    if use_closure
      # --compilation_level ADVANCED_OPTIMIZATIONS
      system("java -jar compiler.jar --js model_viewer_monolith.js --js_output_file model_viewer_monolith_min.js");
    else
      File.open("model_viewer_monolith_min.js", "w") { |output|
        File.open("model_viewer_monolith.js", "r") { |input|
          output.write(input.read())
        }
      }
	end
  
  File.open("model_viewer_monolith_min.js", "r") { |input|
    File.open(output, "w") { |output|
      output.write("/* The MIT License (MIT)\n\nCopyright (c) 2013-2014 Chananya Freiman\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */\n")
      
      if use_closure
        output.write("(function(){")
        output.write("\"use strict\";")
      end
      
      output.write(input.read())
      
      if use_closure
        output.write("}());")
      end
      
    }
  }

  File.delete("src/viewer/shaders.js")
  File.delete("model_viewer_monolith.js")
  File.delete("model_viewer_monolith_min.js")
end

handle_shaders(use_glsl_min, shared_shaders, mdx_shaders, m3_shaders, "src/viewer/")
handle_source(use_closure, code_files, output_path)
