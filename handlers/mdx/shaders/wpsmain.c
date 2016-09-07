uniform sampler2D u_texture;
uniform bool u_alphaTest;
uniform vec4 u_modifier;

varying vec3 v_normal;
varying vec2 v_uv;

uniform bool u_isTeamColor;
uniform bool u_isTeamGlow;
varying vec3 v_teamColor;

varying vec3 v_tintColor;

varying vec4 v_geosetColor;

void main() {
    #ifdef STANDARD_PASS
	vec4 texel;
	
	if (u_isTeamColor)
	{
		texel = vec4(v_teamColor, 1.0);
	}
	else if (u_isTeamGlow)
	{
		// Change the coordinate from [0, 1] to [-1, 1]
		vec2 coord = (v_uv - 0.5) * 2.0;

		// Distance of the coordinate from the center
		float dist = sqrt(coord.x * coord.x + coord.y * coord.y);

		// An estimation of the equation that created the team glow textures used by Warcraft 3
		float factor = max(0.55 - dist, 0.0);

		texel = vec4(factor * v_teamColor, 1.0);
	}
	else
	{
		texel = texture2D(u_texture, v_uv).bgra;
	}

    // 1bit Alpha
    if (u_alphaTest && texel.a < 0.75) {
        discard;
    }

	gl_FragColor = texel * v_geosetColor * vec4(v_tintColor, 1.0);
    #endif

    #ifdef UVS_PASS
    gl_FragColor = vec4(v_uv, 0.0, 1.0);
    #endif

    #ifdef NORMALS_PASS
    gl_FragColor = vec4(v_normal, 1.0);
    #endif

    #ifdef WHITE_PASS
    gl_FragColor = vec4(1.0);
    #endif
}
