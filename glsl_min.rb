# Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

def get_chunks(source)
  chunks = []
  fn = source.index(/\w+\s+\w+\s*\(.*?\)/, 0)
  lastfn = 0
  
  if not fn
    chunks.push({"type" => "dontcare", "data" => source})
  end
  
  while fn do
    if fn - lastfn > 0
      chunks.push({"type" => "dontcare", "data" => source[lastfn..fn-1]})
    end
  
    level = 1
    start = source.index("{", fn)
    
    match = source.match(/(\w+)\s+(\w+)\s*(\(.*?\))/, fn);
    index = start + 1
    
    while level > 0 and index < source.length do
      char = source[index]
      
      if char == "}"
        level -= 1
      elsif char == "{"
        level += 1
      end
      
      index += 1
    end
    
    chunks.push({"type" => "function", "data" => {"returntype" => match[1], "name" => match[2], "arguments" => match[3], "body" => source[start..index-1]}})
    
    fn = source.index(/\w+\s+\w+\s*\(.*?\)/, index)
    lastfn = index
  end
  
  return chunks
end

def rename_locals(data)
  newnames = [*("A".."Z"), *("a".."z")]
  
  data["arguments"].scan(/(in\s+|out\s+)?\w+\s+(\w+)/).each { |argument|
    newname = newnames.shift()
    namereg = /\b#{argument[1]}\b/
    
    data["arguments"] = data["arguments"].sub(namereg, newname)
    data["body"] = data["body"].gsub(namereg, newname)
  }
  
  data["body"].scan(/(bool|bvec2|bvec3|bvec4|int|ivec2|ivec3|ivec4|uint|uvec2|uvec3|uvec4|float|vec2|vec3|vec4|double|dvec2|dvec3|dvec4|mat2|mat2x2|mat2x3|mat2x4|mat3|mat3x2|mat3x3|mat3x4|mat4|mat4x2|mat4x3|mat4x4)\s+(.*?);/m).each { |locals|
    locals[1].split("=")[0].split(",").each { |local|
      data["body"] = data["body"].gsub(/\b#{local.strip()}\b/, newnames.shift())
    }
  }
end

def glsl_min_source(oldsource)
  source = ""
  
  get_chunks(oldsource).each { |chunk|
    data = chunk["data"]
    
    if chunk["type"] == "dontcare"
      source += data
    else
      rename_locals(data)
      source += "#{data["returntype"]} #{data["name"]}#{data["arguments"]}#{data["body"]}"
    end
  }
  
  need_newline = false
  newsource = ""
  
  source.each_line { |line|
    line = line.strip().gsub(/\s{2,}|\t/, " ")
    
    if line[0] == "#"
      if need_newline
        newsource += "\n"
      end
      
      newsource += line + "\n"
      need_newline = false
    else
      need_newline = true
      line = line.sub("\n", "").gsub(/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|\-|!|;)\s*/, "\\1").gsub(/0(\.\d+)/, "\\1")
      
      newsource += line
    end
  }
  
  return newsource.gsub("\n\n", "\n").gsub("\n", "\\n")
end

def glsl_min_file(path)
  return glsl_min_source(IO.read(path))
end