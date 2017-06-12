/**
 * @constructor
 * @see This is used for entries that have known structures (or at least sizes), but this parser isn't going to actually parse.
        The entry will contain its own reader and version, in case the client code wants to do anything with it.
 */
function M3ParserUnsupportedEntry(reader, version, index) {
    this.reader = reader;
    this.version = version;
}
