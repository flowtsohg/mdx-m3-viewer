// Returns a promise that will resolve in the next VM event loop step.
// Used to force the VM to wait, allowing the DOM to update between heavy operations.
export function aFrame() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 0);
  });
}

export async function getAllFileEntries(dataTransferItemList) {
  let files = [];
  let queue = [];

  for (let i = 0; i < dataTransferItemList.length; i++) {
    queue.push(dataTransferItemList[i].webkitGetAsEntry());
  }

  while (queue.length > 0) {
    let entry = queue.shift();

    if (entry.isFile) {
      files.push(entry);
    } else if (entry.isDirectory) {
      queue.push(...await readAllDirectoryEntries(entry.createReader()));
    }
  }

  return files;
}

async function readAllDirectoryEntries(directoryReader) {
  let entries = [];
  let readEntries = await readEntriesPromise(directoryReader);

  while (readEntries.length > 0) {
    entries.push(...readEntries);

    readEntries = await readEntriesPromise(directoryReader);
  }

  return entries;
}

async function readEntriesPromise(directoryReader) {
  try {
    return await new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
  }
}
