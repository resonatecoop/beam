import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "./AuthContextInterface";

const metadataUrl = process.env.REACT_APP_AUTH_METADATA_URL ?? undefined;

export const oidcConfig: AuthProviderProps = {
  authority: process.env.REACT_APP_AUTHORITY ?? "",
  clientId: process.env.REACT_APP_CLIENT_ID ?? "",
  redirectUri: window.location.origin,
  metadataUrl,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  scope: "read_write",
  client_authentication: "client_secret_basic",
  loadUserInfo: false,
  responseType: "code",
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  metadata: metadataUrl
    ? undefined
    : {
        issuer: process.env.REACT_APP_AUTHORITY,
        authorization_endpoint: "https://id.resonate.coop/web/authorize",
        token_endpoint: "https://id.resonate.coop/v1/oauth/tokens",
        userinfo_endpoint: "",
      },
};
