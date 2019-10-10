ModelViewer = ModelViewer.default;

let parsers = ModelViewer.parsers;
let w3x = parsers.w3x;
let utils = ModelViewer.utils;
let Context = utils.jass2.Context;
let ok = false;

const context = new Context();

(function step() {
  requestAnimationFrame(step);

  context.step();
}());

async function fetchAsText(file) {
  return await (await fetch(file)).text();
}

Promise.all([fetchAsText('common.lua'), fetchAsText('Blizzard.lua')])
  .then(([commonj, blizzardj]) => {
    console.log('Loading and running common.j');
    context.run(commonj);
    console.log('Loading and running Blizzard.j');
    context.run(blizzardj);
    console.log('Done');

    // context.run(`
    //   function cb()
    //     print('[LUA] Timer callback called!')
    //     print('[LUA] GetExpiredTimer() = ' .. tostring(GetExpiredTimer()));
    //     print('[LUA] Going to sleep for 3 seconds...')
    //     TriggerSleepAction(3)
    //     print('[LUA] Time to wake up and finish the thread')
    //     DestroyTimer(GetExpiredTimer())
    //   end

    //   function test()
    //     print('[LUA] Creating the timer and starting it with a 3 second timeout')
    //     local timer = CreateTimer()
    //     TimerStart(timer, 3, false, cb)
    //   end
    // `);
    // context.call('test');

    ok = true;
  });

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('dragend', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();

  if (ok) {
    let file = e.dataTransfer.files[0];
    let name = file.name;
    let ext = name.substr(name.lastIndexOf('.')).toLowerCase();

    if (ext === '.w3m' || ext === '.w3x') {
      let reader = new FileReader();

      reader.addEventListener('loadend', (e) => {
        let arrayBuffer = e.target.result;

        console.log('Loading and running the map');
        context.open(new w3x.Map(arrayBuffer));

        console.log('Calling config()');
        context.call('config');

        console.log('Calling main()');
        context.call('main');
      });

      reader.readAsArrayBuffer(file);
    }
  }
});
