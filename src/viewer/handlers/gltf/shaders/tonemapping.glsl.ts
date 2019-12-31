const shader = `
uniform float u_exposure;

#ifdef TONEMAP_UNCHARTED
  vec3 toneMapUncharted2Impl(vec3 color) {
    const float A = 0.15;
    const float B = 0.50;
    const float C = 0.10;
    const float D = 0.20;
    const float E = 0.02;
    const float F = 0.30;

    return ((color * (A * color + C * B) + D * E) / (color * (A * color + B) + D * F)) - E / F;
  }

  vec3 toneMapUncharted(vec3 color) {
    const float W = 11.2;
    color = toneMapUncharted2Impl(color * 2.0);
    vec3 whiteScale = 1.0 / toneMapUncharted2Impl(vec3(W));

    return LINEARtoSRGB(color * whiteScale);
  }
#endif

#ifdef TONEMAP_HEJLRICHARD
  vec3 toneMapHejlRichard(vec3 color) {
    color = max(vec3(0.0), color - vec3(0.004));

    return (color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06);
  }
#endif

#ifdef TONEMAP_ACES
  vec3 toneMapACES(vec3 color) {
    const float A = 2.51;
    const float B = 0.03;
    const float C = 2.43;
    const float D = 0.59;
    const float E = 0.14;
    
    return LINEARtoSRGB(clamp((color * (A * color + B)) / (color * (C * color + D) + E), 0.0, 1.0));
  }
#endif

vec3 toneMap(vec3 color) {
  color *= u_exposure;

  #if defined(TONEMAP_UNCHARTED)
    return toneMapUncharted(color);
  #elif defined(TONEMAP_HEJLRICHARD)
    return toneMapHejlRichard(color);
  #elif defined(TONEMAP_ACES)
    return toneMapACES(color);
  #else
    return LINEARtoSRGB(color);
  #endif
}
`;

export default shader;
