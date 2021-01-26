const urlWithParams = ModelViewer.default.common.urlWithParams;

function localOrHive(src, params) {
  src = src.toLowerCase();

  if (window.location.hostname === '127.0.0.1') {
    return urlWithParams(`${window.location.origin}/assets?path=${src}`, params);
  } else {
    return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${src}`;
  }
}
