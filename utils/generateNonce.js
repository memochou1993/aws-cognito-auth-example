import toSha256 from './toSha256';

const generateNonce = async () => {
  const hash = await toSha256(crypto.getRandomValues(new Uint32Array(4)).toString());
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default generateNonce;
