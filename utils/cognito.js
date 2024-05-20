const redirectToSignIn = ({
  awsCognitoApiUrl,
  clientId: client_id,
  state,
  codeChallenge: code_challenge,
}) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    redirect_uri: `${window.location.origin}/auth/callback`,
    state,
    code_challenge_method: 'S256',
    code_challenge,
  });
  window.location.href = `${awsCognitoApiUrl}/login?${params.toString()}`;
};

const redirectToSignOut = ({
  awsCognitoApiUrl,
  clientId: client_id,
}) => {
  const params = new URLSearchParams({
    client_id,
    logout_uri: `${window.location.origin}/sign-in`,
  });
  window.location.href = `${awsCognitoApiUrl}/logout?${params.toString()}`;
};

const createToken = ({
  awsCognitoApiUrl,
  clientId: client_id,
  redirectUri: redirect_uri,
  code,
  codeVerifier: code_verifier,
}) => {
  return fetch(`${awsCognitoApiUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id,
      redirect_uri,
      code,
      code_verifier,
    }).toString(),
  });
};

export {
  createToken, redirectToSignIn,
  redirectToSignOut
};

