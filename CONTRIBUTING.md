If you want to contribute, here are a few notes:

1) The code must follow the same style.
The repository uses ESLint for linting, with a slightly modified Google configuration (which can be found at https://google.github.io/styleguide/jsguide.html).
It comes with a VSCode workspace that should already handle automatically things like tab-space conversion, braces, and line ends, and uses the given ESLint configuration when told to lint.

2) If the changes are related in any way to the viewer itself (parsers that are used, handlers, shaders, etc.), then the unit tests must all pass.
This of course doesn't include unit tests that are directly related to the changes, and thus need to be updated.
For now this can be ignored to some extent, because there is no easy way to setup the tests, since I cannot add here the required Warcraft 3 and Starcraft 2 files.

3) If the changes are related to real-time parts of the code, they should be efficient! There are no such things as real-time heap allocations (e.g. `new`, `[]`, `{}`), typed arrays are generally preferred for data storage over arrays/objects, and so on.

4) Use webpack-dev rather than webpack-prod. The former will stay open and watch your files. As you edit and save them, it will continuously build the source and report any issues if there are any.

5) Have fun :)