import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps, UserManager } from "oidc-react";

const userManager = new UserManager({
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: process.env.REACT_APP_AUTHORITY ?? "",
  client_id: process.env.REACT_APP_CLIENT_ID ?? "",
  redirect_uri: window.location.origin,
  client_secret: process.env.REACT_APP_CLIENT_SECRET ?? "missing",
  response_type: "code",
  scope: "read_write",
  revokeTokensOnSignout: true,
  // loadUserInfo: true,
  automaticSilentRenew: true,
});

export const oidcConfig: AuthProviderProps = {
  userManager: userManager,
};
