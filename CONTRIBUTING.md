If you want to contribute, here are a few notes:

1) If the changes are related in any way to the viewer itself (parsers that are used, handlers, shaders, etc.), then the unit tests must all pass.
This of course doesn't include unit tests that are directly related to the changes, and thus need to be updated.

2) If the changes are related to real-time parts of the code, they should be efficient! There are no such things as real-time heap allocations (e.g. `new`, `[]`, `{}`), typed arrays are generally preferred for data storage over arrays/objects, and so on.

3) Use `npm run dev` to start webpack in watch mode and re-build the source as you write it.

4) Have fun :)
