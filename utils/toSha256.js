const toSha256 = async (str) => {
  return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
};

export default toSha256;
