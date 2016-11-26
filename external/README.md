[glMatrix](http://glmatrix.net/) is used by the whole viewer, and is required.

[jpgjs](https://github.com/notmasteryet/jpgjs) is used by the Blp handler (and thus also the Mdx handler).
Note that this file was modified, to allow Warcraft 3's usage of JPEG data (each pixel is BGRA - yes, that's right, including alpha).

[inflate](https://github.com/imaya/zlib.js/blob/master/bin/inflate.min.js) is used by the Mpq handler (and thus also the W3x handler).
