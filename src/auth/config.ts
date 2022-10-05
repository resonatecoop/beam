import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps, UserManager } from "oidc-react";
// import { AuthProviderProps } from "./AuthContextInterface";

const userManager = new UserManager({
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: process.env.REACT_APP_AUTHORITY ?? "",
  client_id: process.env.REACT_APP_CLIENT_ID ?? "",
  redirect_uri: window.location.origin,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  response_type: "code",
  scope: "read_write",
  revokeTokensOnSignout: true,
  // loadUserInfo: true,
  automaticSilentRenew: true,
});

export const oidcConfig: AuthProviderProps = {
  // authority: process.env.REACT_APP_AUTHORITY ?? "",
  // clientId: process.env.REACT_APP_CLIENT_ID ?? "",
  // redirectUri: window.location.origin,
  // // metadataUrl,
  // clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  // scope: "read_write",
  // // client_authentication: "client_secret_basic",
  // // loadUserInfo: false,
  // responseType: "code",
  // automaticSilentRenew: true,
  userManager: userManager,
};
