import React, { FC, useState, useEffect, useRef } from "react";
import { UserManager, User } from "oidc-client-ts";
import {
  Location,
  AuthProviderProps,
  AuthContextProps,
} from "./AuthContextInterface";
import { useLocation } from "react-router-dom";
import { oidcConfig } from "./config";

export const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

const isLocalFile = () => window.location.href.includes(".html");

/**
 * @private
 * @hidden
 * @param location
 */
export const hasCodeInUrl = (location: Location): boolean => {
  const searchParams = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams(location.hash.replace("#", "?"));
  return Boolean(
    searchParams.get("code") ||
      searchParams.get("id_token") ||
      searchParams.get("session_state") ||
      hashParams.get("code") ||
      hashParams.get("id_token") ||
      hashParams.get("session_state")
  );
};

/**
 * @private
 * @hidden
 * @param props
 */
export const initUserManager = (props: AuthProviderProps): UserManager => {
  // if (props.userManager) return props.userManager;
  const {
    authority,
    clientId,
    clientSecret,
    redirectUri,
    silentRedirectUri,
    postLogoutRedirectUri,
    responseType,
    scope,
    automaticSilentRenew,
    loadUserInfo,
    userStore,
    popupRedirectUri,
    popupWindowTarget,
    metadata,
    client_authentication,
  } = props;
  return new UserManager({
    authority,
    metadata,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    silent_redirect_uri: silentRedirectUri || redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri || redirectUri,
    response_type: responseType || "code",
    scope: scope || "openid",
    loadUserInfo: loadUserInfo !== undefined ? loadUserInfo : true,
    popup_redirect_uri: popupRedirectUri,
    popupWindowTarget,
    automaticSilentRenew,
    client_authentication,
    userStore,
  });
};

/**
 *
 * @param props AuthProviderProps
 */
export const AuthProvider: FC<AuthProviderProps> = ({
  children,
  autoSignIn = true,
  onBeforeSignIn,
  onSignIn,
  onSignOut,
  location = window.location,
  ...props
}) => {
  const locationFromRouteMemory = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [userManager] = useState<UserManager>(() => initUserManager(props));

  const signOutHooks = async (): Promise<void> => {
    setUserData(null);
    onSignOut && onSignOut();
  };

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      /**
       * Check if the user is returning back from OIDC.
       */
      let checkInside = location;
      if (isLocalFile()) {
        checkInside = locationFromRouteMemory;
      }
      if (hasCodeInUrl(checkInside)) {
        try {
          const constructingUrl = isLocalFile()
            ? `${oidcConfig.redirectUri}${locationFromRouteMemory.pathname}${locationFromRouteMemory.search}` // We're just building something that passes as a URL
            : undefined;

          const user = await userManager.signinCallback(constructingUrl);
          if (user) {
            setUserData(user);
            onSignIn && onSignIn(user);
          }
        } catch (e) {
          console.error("e", e);
        }
        setIsLoading(false);
        return;
      }

      const user = await userManager!.getUser();
      if (user?.expired) {
        await userManager.signinSilent();
      } else if (isMountedRef.current) {
        setUserData(user);
      }
      setIsLoading(false);
      return;
    };
    getUser();
  }, [
    userManager,
    autoSignIn,
    onBeforeSignIn,
    onSignIn,
    locationFromRouteMemory,
    location,
  ]);

  useEffect(() => {
    // for refreshing react state when new state is available in e.g. session storage
    const updateUserData = async () => {
      const user = await userManager.getUser();
      isMountedRef.current && setUserData(user);
    };

    userManager.events.addUserLoaded(updateUserData);

    return () => userManager.events.removeUserLoaded(updateUserData);
  }, [userManager]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (args: unknown): Promise<void> => {
          // @ts-ignore
          await userManager.signinRedirect(args);
        },
        signInPopup: async (): Promise<void> => {
          // await signInPopupHooks();
        },
        signOut: async (): Promise<void> => {
          await userManager!.removeUser();
          await signOutHooks();
        },
        signOutRedirect: async (args?: unknown): Promise<void> => {
          // await userManager!.signoutRedirect(args);
          await signOutHooks();
        },
        userManager,
        userData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
