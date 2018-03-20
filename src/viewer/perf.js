export class Perf {
    constructor() {
        this.startFrameTime = 0;
        this.frameTime = 0;

        this.startUpdateTime = 0;
        this.updateTime = 0;

        this.startInstanceUpdatesTime = 0;
        this.instanceUpdatesTime = 0;

        this.startBucketUpdatesTime = 0;
        this.bucketUpdatesTime = 0;

        this.startRenderTime = 0;
        this.renderTime = 0;

        this.skeletonUpdatesTime = 0;
        this.skeletonUpdateTime = 0;
    }

    startFrame() {
        this.startFrameTime = performance.now();
    }

    endFrame() {
        this.frameTime = performance.now() - this.startFrameTime;
    }

    startUpdate() {
        this.startUpdateTime = performance.now();
    }

    endUpdate() {
        this.updateTime = performance.now() - this.startUpdateTime;
    }

    startInstanceUpdates() {
        this.startInstanceUpdatesTime = performance.now();
        this.skeletonUpdatesTime = 0;
    }

    endInstanceUpdates() {
        this.instanceUpdatesTime = performance.now() - this.startInstanceUpdatesTime;
    }

    startSkeletonUpdate() {
        this.skeletonUpdateTime = performance.now();
    }

    endSkeletonUpdate() {
        this.skeletonUpdatesTime += performance.now() - this.skeletonUpdateTime;
    }
    startBucketUpdates() {
        this.startBucketUpdatesTime = performance.now();
    }

    endBucketUpdates() {
        this.bucketUpdatesTime = performance.now() - this.startBucketUpdatesTime;
    }

    startRender() {
        this.startRenderTime = performance.now();
    }

    endRender() {
        this.renderTime = performance.now() - this.startRenderTime;
    }
};

export class PerfViewer {
    constructor() {
        this.container = document.createElement('div');
        this.rows = {
            frame: this.addRow('Frame', 0),
            update: this.addRow('Update', 1),
            instanceUpdates: this.addRow('Instances', 2),
            skeletonUpdates: this.addRow('Skeletons', 3),
            bucketUpdates: this.addRow('Buckets', 2),
            render: this.addRow('Render', 1)
        };
    }

    addRow(header, indent) {
        let container = document.createElement('div');
        container.style.marginLeft = `${indent}em`;
    
        let name = document.createElement('span');
        name.textContent = header;
    
        let value = document.createElement('span');
    
        container.appendChild(name);
        container.appendChild(document.createTextNode(' '));
        container.appendChild(value);

        this.container.appendChild(container);
    
        return { container, name, value };
    }

    update(perf) {
        let rows = this.rows;

        rows.frame.value.textContent = perf.frameTime;
        rows.update.value.textContent = perf.updateTime;
        rows.instanceUpdates.value.textContent = perf.instanceUpdatesTime;
        rows.skeletonUpdates.value.textContent = perf.skeletonUpdatesTime;
        rows.bucketUpdates.value.textContent = perf.bucketUpdatesTime;
        rows.render.value.textContent = perf.renderTime;
    }
};
