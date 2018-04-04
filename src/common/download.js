export function downloadUrl(url, name) {
    let a = document.createElement('a');

    a.href = url;
    a.download = name;

    a.dispatchEvent(new MouseEvent('click'));
};

export function downloadBlob(blob, name) {
    let url = URL.createObjectURL(blob);

    downloadUrl(url, name);

    URL.revokeObjectURL(url);
};

export function downloadBuffer(arrayBuffer, name) {
    downloadBlob(new Blob([arrayBuffer], { type: 'application/octet-stream' }), name);
};
