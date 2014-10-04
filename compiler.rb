use_glsl_min = true
use_closure = true
annonymify_code = true
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
  ["math", [
    "math/gl-matrix",
    "math/gl-matrix-addon",
    "math/math",
    "math/interpolator",
  ]],
  
  "binaryreader/binaryreader",
  "base",
  
  ["gl", [
    "gl/before",
    "gl/nativetexture",
    "gl/shader",
    "gl/rect",
    "gl/cube",
    "gl/sphere",
    "gl/cylinder",
    "gl/gl",
    "gl/after"
  ]],
  
  "async",
  "spatial",
  "basemodel",
  "basemodelinstance",
  
  "viewer/shaders",
    
  ["modelviewer", [
    "viewer/before",
    "viewer/asyncmodel",
    "viewer/asyncmodelinstance",
    "viewer/after"
  ]],
  
  "handlers/jpg",
  "handlers/blptexture",
  "handlers/ddstexture",
  "handlers/tgatexture",
  
  ["mdx", [
    "handlers/mdx/before",
    "handlers/mdx/parser",
    "handlers/mdx/sd",
    "handlers/mdx/skeleton",
    "handlers/mdx/collisionshape",
    "handlers/mdx/model",
    "handlers/mdx/modelinstance",
    "handlers/mdx/texture",
    "handlers/mdx/geoset",
    "handlers/mdx/layer",
    "handlers/mdx/geosetanimation",
    "handlers/mdx/textureanimation",
    "handlers/mdx/node",
    "handlers/mdx/attachment",
    "handlers/mdx/particle",
    "handlers/mdx/particleemitter",
    "handlers/mdx/particle2",
    "handlers/mdx/particleemitter2",
    "handlers/mdx/ribbon",
    "handlers/mdx/ribbonemitter",
    "handlers/mdx/after"
  ]],
  
  ["m3", [
    "handlers/m3/before",
    "handlers/m3/parser",
    "handlers/m3/sd",
    "handlers/m3/sts",
    "handlers/m3/stc",
    "handlers/m3/stg",
    "handlers/m3/skeleton",
    "handlers/m3/boundingshape",
    "handlers/m3/region",
    "handlers/m3/layer",
    "handlers/m3/standardmaterial",
    "handlers/m3/model",
    "handlers/m3/modelinstance",
    #"handlers/m3/particle",
    #"handlers/m3/particleemitter",
    "handlers/m3/after"
  ]]
  
  #"../examples/objmodel",
  #"../examples/objmodelinstance",
  #"../examples/bmptexture"
]

@license = "/* The MIT License (MIT)\n\nCopyright (c) 2013-2014 Chananya Freiman\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */\n"

def compile_shaders(use_glsl_min)
  srcpath = "src/handlers/"
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

def compile_source(use_glsl_min, use_closure, annonymify_code)
  require "fileutils"
  
  compile_shaders(use_glsl_min)
  
  code_files = []
  
  # If the output directory doesn't exist, create it
  unless File.directory?("build")
    FileUtils.mkdir_p("build")
  end

  # If the final output directory doesn't exist, create it
  unless File.directory?("build/output/")
    FileUtils.mkdir_p("build/output/")
  end
  
  # Create the proper code files in the output directory
  @code_files.each { |code_file|
    if code_file.is_a?(String)
      code_files.push(File.basename(code_file))
      
      File.open("build/#{File.basename(code_file)}.js", "w") { |output|
        output.write(IO.read("src/" + code_file + ".js"))
      }
    else
      code_files.push(code_file[0])
      
      File.open("build/#{code_file[0]}.js", "w") { |output|
        code_file[1].each { |entry|
          output.write(IO.read("src/" + entry + ".js"))
        }
      }
    end
  }
  
  # Create the full viewer
  File.open("build/output/viewer.js", "w") { |output|
    # Without putting everything in local scope, Closure doesn't fully minify the source
    if use_closure
      output.write("(function(){\"use strict\";")
    end
    
    code_files.each { |file|
      output.write(IO.read("build/#{file}.js"))
    }
    
    if use_closure
      output.write("}());")
    end
  }
  
  if use_closure
    # --compilation_level ADVANCED_OPTIMIZATIONS
    system("java -jar compiler.jar --js build/output/viewer.js --js_output_file build/output/viewer_min.js");
    
    # Write the final minified full viewer
    data = IO.read("build/output/viewer_min.js")
    File.open("build/output/viewer_min.js", "w") { |output|
      output.write(@license)
      
      if annonymify_code
        output.write("(function(){\"use strict\";")
      end
      
      output.write(data)
      
      if annonymify_code
        output.write("}());")
      end
    }
  end
  
  # Write the final full viewer
  data = IO.read("build/output/viewer.js")
  File.open("build/output/viewer.js", "w") { |output|
    output.write(@license)
    
    if annonymify_code
      output.write("(function(){")
      output.write("\"use strict\";")
    end
    
    output.write(data)
    
    if annonymify_code
      output.write("}());")
    end
  }
end

def compile(use_glsl_min, use_closure, annonymify_code, compile_docs)
  if compile_docs
    @code_files.push("doctypes")
    
    compile_source(false, false, false)
    
    # If the docs directory doesn't exist, create it
    unless File.directory?("docs")
      FileUtils.mkdir_p("docs")
    end
  
    system("jsdoc build -d docs")
  else
    compile_source(use_glsl_min, use_closure, annonymify_code)
  end
end
  
compile(use_glsl_min, use_closure, annonymify_code, compile_docs)
