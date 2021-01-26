// Returns a promise that will resolve in the next VM event loop step.
// Used to force the VM to wait, allowing the DOM to update between heavy operations.
function aFrame() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 0);
  });
}
