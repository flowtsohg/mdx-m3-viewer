export default function get(path, binary, onprogress) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr);
            } else {
                reject(xhr);
            }
        });

        xhr.addEventListener('error', function () {
            reject(xhr);
        });

        if (onprogress) {
            xhr.addEventListener('progress', onprogress);
        }

        xhr.open('GET', path, true);

        if (binary) {
            xhr.responseType = 'arraybuffer';
        }

        xhr.send();
    });
};
