/**
 * @param {string} src
 * @param {object} params
 * @return {string}
 */
export default function urlWithParams(src, params) {
  if (params) {
    let encodedParams = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    let separator = '&';

    if (src.indexOf('?') === -1) {
      separator = '?';
    }

    return `${src}${separator}${encodedParams}`;
  }

  return src;
}
