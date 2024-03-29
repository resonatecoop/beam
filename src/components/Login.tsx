import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "oidc-react";

import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";

const Header = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const navigate = useNavigate();
  const { signIn, userData } = useAuth();

  const onOAuth2Click = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (userData && userData.access_token !== "" && !userData?.expired) {
      navigate("/profile");
    } else {
      signIn();
    }
  };

  return (
    <>
      <Button
        onClick={onOAuth2Click}
        data-cy="log-in"
        // startIcon={isLoading ? <LoadingSpinner /> : undefined}
        // disabled={isLoading}
      >
        {user ? `${user?.displayName} Profile` : "Log in"}
      </Button>
    </>
  );
};

export default Header;
