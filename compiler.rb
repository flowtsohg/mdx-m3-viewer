use_glsl_min = false
use_closure = false
annonymify_code = false
compile_docs = false

@shader_files = [
    # Shared shaders
    "handlers/sharedshaders/vsbonetexture",
    "handlers/sharedshaders/decodefloat",
    "handlers/sharedshaders/vsworld",
    "handlers/sharedshaders/vswhite",
    "handlers/sharedshaders/psworld",
    "handlers/sharedshaders/pswhite",
    "handlers/sharedshaders/pscolor",  
    # Warcraft 3 shaders
    "handlers/mdx/shaders/wvsmain",
    "handlers/mdx/shaders/wvsribbons",
    "handlers/mdx/shaders/wvsparticles",
    "handlers/mdx/shaders/wvscolor",
    "handlers/mdx/shaders/wvswhite",
    "handlers/mdx/shaders/wpsmain",
    "handlers/mdx/shaders/wpsparticles",
    # Starcraft 2 shaders
    "handlers/m3/shaders/svscommon",
    "handlers/m3/shaders/svsstandard",
    "handlers/m3/shaders/svscolor",
    "handlers/m3/shaders/spscommon",
    "handlers/m3/shaders/spsstandard",
    "handlers/m3/shaders/svswhite",
    "handlers/m3/shaders/spsspecialized",
    "handlers/m3/shaders/svsparticles",
    "handlers/m3/shaders/spsparticles"
]

@code_files = [
    ["math", [
        "math/common",
        "math/vec3",
        "math/vec4",
        "math/mat3",
        "math/mat4",
        "math/quat",
        "math/gl-matrix-addon",
        "math/math",
        "math/interpolator"
    ]],

    "binaryreader/binaryreader",
    "base",

    "gl/rect",
    "gl/cube",
    "gl/sphere",
    "gl/cylinder",
        
    ["gl", [
        "gl/before",
        "gl/texture",
        "gl/nativetexture",
        "gl/shader",
        "gl/gl",
        "gl/after"
    ]],
    
    "camera",
    
    "async",
    "spatial",

    "basenode",
    "baseskeleton",
    "basemodel",
    "basemodelinstance",

    "asyncmodel",
    "asyncmodelinstance",
    
    "viewer/viewer",

    "handlers/jpg",
    "handlers/blptexture",
    "handlers/ddstexture",
    "handlers/tgatexture",

    # Not an actual file, the shaders will be injected here
    "shaders",
    
    ["mdx", [
        "handlers/mdx/before",
        "handlers/mdx/parser",
        "handlers/mdx/sd",
        "handlers/mdx/skeleton",
        "handlers/mdx/collisionshape",
        "handlers/mdx/camera",
        "handlers/mdx/model",
        "handlers/mdx/modelinstance",
        "handlers/mdx/texture",
        "handlers/mdx/geoset",
        "handlers/mdx/layer",
        "handlers/mdx/geosetanimation",
        "handlers/mdx/textureanimation",
        "handlers/mdx/node",
        "handlers/mdx/attachment",
        "handlers/mdx/eventobjectspn",
        "handlers/mdx/eventobjectspl",
        "handlers/mdx/eventobjectubr",
        "handlers/mdx/eventobjectemitter",
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
]

@license = "/* The MIT License (MIT)\n\nCopyright (c) 2013-2014 Chananya Freiman\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */\n"

require "fileutils"

# If the output directory doesn't exist, create it
unless File.directory?("build")
    FileUtils.mkdir_p("build")
end

# If the final output directory doesn't exist, create it
unless File.directory?("build/output/")
    FileUtils.mkdir_p("build/output/")
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
  
def compile_shaders(use_glsl_min)
    paths = @shader_files.map { |path| "src/#{path}.c" }
    shaders = []

    if use_glsl_min
        minified = minify_files(paths , false)

        paths.each_index { |i|
            shaders.push("\"#{File.basename(@shader_files[i])}\":\"#{minified[0][i]}\"")
        }
    else
        paths.each_index { |i|
            shaders.push("\"#{File.basename(@shader_files[i])}\":\"#{IO.read(paths[i]).gsub(/\r?\n/, "\\n")}\"")
        }
    end

    return "var SHADERS = {\n\t#{shaders.join(",\n\t")}\n};"
end

def compile_source(use_glsl_min, use_closure, annonymify_code)
    code_files = []

    # Create the proper code files in the output directory
    @code_files.each { |code_file|
        if code_file.is_a?(String)
            code_files.push(File.basename(code_file))

            File.open("build/#{File.basename(code_file)}.js", "w") { |output|
                if code_file == "shaders"
                    output.write(compile_shaders(use_glsl_min))
                else
                    output.write(IO.read("src/" + code_file + ".js"))
                end
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
        puts "Compressing the output with Closure"

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
        puts "Generating the docs"

        @code_files.push("doctypes")

        compile_source(false, false, false)

        # If the docs directory doesn't exist, create it
        unless File.directory?("docs")
            FileUtils.mkdir_p("docs")
        end

        system("jsdoc build -d docs")

        @code_files.pop()
    end

    puts "Generating the viewer"

    compile_source(use_glsl_min, use_closure, annonymify_code)
end
  
compile(use_glsl_min, use_closure, annonymify_code, compile_docs)
