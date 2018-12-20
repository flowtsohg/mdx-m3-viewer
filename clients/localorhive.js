function localOrHive(src, game) {
  src = src.toLowerCase();
  game = game || 'warcraft';

  if (window.location.hostname === '127.0.0.1') {
    return `../../../resources/${game}/${src}`;
  } else {
    // return `https://www.hiveworkshop.com/mpq-contents/?path=${src}`;
    // NEW HIVE API
    return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${src}`;
  }
}

