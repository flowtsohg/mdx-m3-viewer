use_glsl_min = true
use_closure = true
annonymify_code = true
output_dir = ""
docs_output_dir = "docs/"
compile_docs = false

@mdx_shaders = [
  "vsmain",
  "vsribbons",
  "vsparticles",
  "vscolor",
  "psmain",
  "psparticles"
]

@m3_shaders = [
  "vscommon",
  "vsstandard",
  "vscolor",
  "pscommon",
  "psstandard",
  "psspecialized",
  "vsparticles",
  "psparticles"
]

@shared_shaders = [
  "vsbonetexture",
  "decodefloat",
  "vsworld",
  "vswhite",
  "psworld",
  "pswhite",
  "pscolor"
]

@code_files = [
  "math/gl-matrix",
  "math/gl-matrix-addon",
  "math/math",
  "math/interpolator",
  "binaryreader/binaryreader",
  "base",
  "basemodel",
  "basemodelinstance",
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
  "viewer/async",
  "viewer/spatial",
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
  "viewer/asyncmodel",
  "viewer/asyncmodelinstance",
  "viewer/after"
  #"../examples/objmodel",
  #"../examples/objmodelinstance",
  #"../examples/bmptexture"
]

def compile_shaders(use_glsl_min)
  srcpath = "src/viewer/"
  names = @shared_shaders + @mdx_shaders.map { |p| "w" + p } + @m3_shaders.map { |p| "s" + p }
  paths = @shared_shaders.map { |p| srcpath + "sharedshaders/" + p + ".c" } + @mdx_shaders.map { |p| srcpath + "mdx/shaders/" + p + ".c" } + @m3_shaders.map { |p| srcpath + "m3/shaders/" + p + ".c" }
  shaders = []
  
  # Check for the existence of glsl_min
  # https://github.com/flowtsohg/glsl-minifier
  if use_glsl_min
    begin
      require_relative "glsl_min"
    rescue LoadError
      use_glsl_min = false
    end
  end

  if use_glsl_min
    minified = minify_files(paths , false)
    
    names.each_index { |i|
      shaders.push("\"#{names[i]}\":\"#{minified[0][i]}\"")
    }
  else
    names.each_index { |i|
      shaders.push("\"#{names[i]}\":\"#{IO.read(paths[i]).gsub(/\r?\n/, "\\n")}\"")
    }
  end
  
  File.open("src/viewer/shaders.js", "w") { |out|
    out.write("var SHADERS = {\n\t#{shaders.join(",\n\t")}\n};")
  }
end

def compile_source(use_glsl_min, use_closure, annonymify_code, output_dir)
    compile_shaders(use_glsl_min)
    
    File.open("#{output_dir}model_viewer_monolith.js", "w") { |output|
      if annonymify_code
        output.write("(function () {\n")
        output.write("\"use strict\";\n")
      end
    
      @code_files.each { |file|
        output.write("\n")
        output.write(IO.read("src/" + file + ".js"))
        output.write("\n")
      }
      
      if annonymify_code
        output.write("}());")
      end
    }
	
    # Check for the existence of the Closure compiler
    # https://developers.google.com/closure/compiler/
    if use_closure and not File.file?("compiler.jar")
      use_closure = false
    end

    if use_closure
      # --compilation_level ADVANCED_OPTIMIZATIONS
      system("java -jar compiler.jar --js #{output_dir}model_viewer_monolith.js --js_output_file #{output_dir}model_viewer_monolith_min.js");
    else
      File.open("#{output_dir}model_viewer_monolith_min.js", "w") { |output|
        File.open("#{output_dir}model_viewer_monolith.js", "r") { |input|
          output.write(input.read())
        }
      }
	end
  
  File.open("#{output_dir}model_viewer_monolith_min.js", "r") { |input|
    File.open("#{output_dir}viewer.js", "w") { |output|
      output.write("/* The MIT License (MIT)\n\nCopyright (c) 2013-2014 Chananya Freiman\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */\n")
      
      if use_closure and annonymify_code
        output.write("(function(){")
        output.write("\"use strict\";")
      end
      
      output.write(input.read())
      
      if use_closure and annonymify_code
        output.write("}());")
      end
      
    }
  }

  File.delete("src/viewer/shaders.js")
  File.delete("#{output_dir}model_viewer_monolith.js")
  File.delete("#{output_dir}model_viewer_monolith_min.js")
end

def compile(use_glsl_min, use_closure, annonymify_code, output_dir, docs_output_dir, compile_docs)
  if compile_docs
    @code_files.push("doctypes")
    @code_files.push("gl/doctypes")
    
    compile_source(false, false, false, docs_output_dir)
    
    system("jsdoc #{docs_output_dir} -d #{docs_output_dir}")
    
    File.delete("#{docs_output_dir}viewer.js")
  else
    compile_source(use_glsl_min, use_closure, annonymify_code, output_dir)
  end
end
  
compile(use_glsl_min, use_closure, annonymify_code, output_dir, docs_output_dir, compile_docs)
