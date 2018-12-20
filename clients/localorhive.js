function localOrHive(src) {
  if (window.location.hostname === '127.0.0.1') {
    return `../../../resources/warcraft/${src}`;
  } else {
    // return `https://www.hiveworkshop.com/mpq-contents/?path=${src}`;
    // NEW HIVE API
    return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${src}`;
  }
}
