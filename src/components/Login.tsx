// import { css } from "@emotion/css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

import { useGlobalStateContext } from "../contexts/globalState";
// import { logInUserWithPassword } from "../services/Api";
import Button from "./common/Button";
import Disclaimer from "./common/Disclaimer";
// import Input from "./common/Input";
import Modal from "./common/Modal";

// const formWrapper = css`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
// `;

const Header = () => {
  const {
    state: { user, token: cachedToken },
    dispatch,
  } = useGlobalStateContext();
  const navigate = useNavigate();
  // const { userData } = useAuth();
  const { signIn, userData } = useAuth();
  const [openLogin, setOpenLogin] = React.useState(false);
  // const [token, setToken] = React.useState<string>(
  //   userData?.access_token ?? ""
  // );
  // const [username, setUsername] = React.useState<string>("");
  // const [password, setPassword] = React.useState<string>("");

  React.useEffect(() => {
    // setToken(userData?.access_token ?? "");
    if (userData && userData?.access_token !== "") {
      dispatch({ type: "setToken", token: userData.access_token });
    }
  }, [userData, dispatch]);

  // const onClickOpen = React.useCallback(() => {
  //   if (cachedToken) {
  //     navigate("/profile");
  //   } else {
  //     setOpenLogin(true);
  //   }
  // }, [navigate, cachedToken]);

  const onClose = React.useCallback(() => {
    setOpenLogin(false);
  }, []);

  // const onChangeToken = React.useCallback(
  //   (e?: React.ChangeEvent<HTMLInputElement>) => {
  //     setToken(e?.target?.value ?? "");
  //   },
  //   []
  // );

  // const onChangeEmail = React.useCallback(
  //   (e?: React.ChangeEvent<HTMLInputElement>) => {
  //     setUsername(e?.target?.value ?? "");
  //   },
  //   []
  // );

  // const onChangePassword = React.useCallback(
  //   (e?: React.ChangeEvent<HTMLInputElement>) => {
  //     setPassword(e?.target?.value ?? "");
  //   },
  //   []
  // );

  // const onSubmitToken = (e?: React.MouseEvent<HTMLButtonElement>) => {
  //   e?.preventDefault();
  //   dispatch({ type: "setToken", token: token });
  //   setOpenLogin(false);
  // };

  // const onLogIn = async (e?: React.MouseEvent<HTMLButtonElement>) => {
  //   e?.preventDefault();
  //   const { access_token: token } = await logInUserWithPassword({
  //     username,
  //     password,
  //   });
  //   setPassword("");
  //   dispatch({ type: "setToken", token });
  //   setOpenLogin(false);
  // };

  const onOAuth2Click = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (userData && userData.access_token !== "") {
      navigate("/profile");
    } else {
      signIn();
    }
  };

  // const isDev = window.location.origin.includes("localhost:8080");

  return (
    <>
      <Button onClick={onOAuth2Click}>
        {cachedToken && cachedToken !== "" ? user?.nickname : "Log in"}
      </Button>
      <Modal open={openLogin} onClose={onClose} size="small">
        {/** if the user is on the dev environment, we can't use the v1 api,
         * cause it requires CORS, but if they are in the app, then we can
         * use the API */}
        {/* {(!cachedToken || cachedToken === "") && (
          <>
            {isDev && (
              <form className={formWrapper}>
                <label>
                  Because you're developing the app you need to log in with your
                  own <code>token</code>. You can copy it from any v2 API
                  request header on stream.resonate.coop. It's a hack until the
                  authentication situation is fixed.
                </label>
                <Input name="token" value={token} onChange={onChangeToken} />
                <Button onClick={onSubmitToken}>Submit Token</Button>
              </form>
            )}
            {!isDev && (
              <form className={formWrapper}>
                <label>Log in</label>
                <Input
                  name="password"
                  value={username}
                  onChange={onChangeEmail}
                />
                <Input
                  name="email"
                  value={password}
                  onChange={onChangePassword}
                />
                <Button onClick={onLogIn}>Log in</Button>
              </form>
            )}
          </>
        )} */}
        <Disclaimer />
      </Modal>
    </>
  );
};

export default Header;
