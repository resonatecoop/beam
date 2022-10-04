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
};
