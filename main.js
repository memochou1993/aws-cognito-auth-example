import './style.css';
import { cognito, generateNonce, toBase64Url, toSha256 } from './utils';

const awsCognitoApiUrl = 'your-cognito-api-url';
const awsCognitoClientId = 'your-cognito-client-id';

document.querySelector('#app').innerHTML = `
  <button type="button" id="sign-in">Sign In</button>
  <button type="button" id="sign-out">Sign Out</button>
`;

const handleSignIn = async () => {
  const nonce = await generateNonce();
  const codeVerifier = await generateNonce();

  sessionStorage.setItem('state', nonce);
  sessionStorage.setItem('code_verifier', codeVerifier);

  cognito.redirectToSignIn({
    awsCognitoApiUrl,
    clientId: awsCognitoClientId,
    state: nonce,
    codeChallenge: toBase64Url(await toSha256(codeVerifier)),
  });
};

const handleSignOut = () => {
  cognito.redirectToSignOut({
    awsCognitoApiUrl,
    clientId: awsCognitoClientId,
  });
};

const handleCallback = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  
  const localState = sessionStorage.getItem('state');
  const localCodeVerifier = sessionStorage.getItem('code_verifier');

  sessionStorage.removeItem('state');
  sessionStorage.removeItem('code_verifier');

  if (!state || !code || !localState || !localCodeVerifier || (state !== localState)) {
    throw new Error('Invalid state or code');
  }

  const res = await cognito.createToken({
    awsCognitoApiUrl,
    clientId: awsCognitoClientId,
    redirectUri: `${window.location.origin}/auth/callback`,
    code,
    codeVerifier: localCodeVerifier,
  });

  const { access_token } = await res.json();

  console.log(access_token);
};

document.getElementById('sign-in').addEventListener('click', handleSignIn);
document.getElementById('sign-out').addEventListener('click', handleSignOut);

if (window.location.pathname === '/auth/callback') {
  handleCallback();
}
