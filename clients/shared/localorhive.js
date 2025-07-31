import urlWithParams from '../../src/common/urlwithparams';

export default function localOrHive(src, params) {
  src = src.toLowerCase();

  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    return urlWithParams(`${window.location.origin}/assets/${src}`, params);
  } else {
    // if (params && (params.reforged || params.sc2)) {
    return `https://www.hiveworkshop.com/casc-contents?path=${src}`;
    // } else {
    //return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${src}`;
    // }
  }
}
