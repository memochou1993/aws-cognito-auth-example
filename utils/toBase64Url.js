const toBase64Url = (string) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export default toBase64Url;
