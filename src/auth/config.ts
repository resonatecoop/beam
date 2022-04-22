import { AuthProviderProps } from "./AuthContextInterface";

export const oidcConfig: AuthProviderProps = {
  authority: "https://id.resonate.coop",
  clientId: "c9gk6i5vqc7o388g0jvg",
  redirectUri: "http://localhost:8080",
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  scope: "read_write",
  client_authentication: "client_secret_basic",
  loadUserInfo: false,
  responseType: "code",
  metadata: {
    issuer: "https://id.resonate.coop",
    authorization_endpoint: "https://id.resonate.coop/web/authorize",
    token_endpoint: "https://id.resonate.coop/v1/oauth/tokens",
    userinfo_endpoint: "",
    // jwks_uri: "https://slack.com/openid/connect/keys",
  },
};
