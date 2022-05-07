import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import LoadingSpinner from "./common/LoadingSpinner";

const Header = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const navigate = useNavigate();
  const { signIn, userData, isLoading } = useAuth();

  const onOAuth2Click = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (userData && userData.access_token !== "") {
      navigate("/profile");
    } else {
      signIn();
    }
  };

  return (
    <>
      <Button
        onClick={onOAuth2Click}
        startIcon={isLoading ? <LoadingSpinner /> : undefined}
        disabled={isLoading}
      >
        {user ? user?.nickname : "Log in"}
      </Button>
    </>
  );
};

export default Header;
