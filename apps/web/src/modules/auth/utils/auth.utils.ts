import type { BuildOAuthUrlParams } from '../types/auth.types';

export const buildOAuthUrl = ({
  authUrl,
  clientId,
  redirectUri,
  scope,
  state,
  extraParams = '',
}: BuildOAuthUrlParams): string => {
  const url = new URL(authUrl);

  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  return `${url.toString()}${extraParams}`;
};
