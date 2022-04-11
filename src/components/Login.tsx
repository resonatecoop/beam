import { css } from "@emotion/css";
import React from "react";

import { useGlobalStateContext } from "../contexts/globalState";
import { logInUserWithPassword } from "../services/Api";
import Button from "./common/Button";
import Input from "./common/Input";
import Modal from "./common/Modal";

const formWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const pClass = css`
  display: flex;
  margin: 0.25rem 0;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;

const Header = () => {
  const {
    state: { user, token: cachedToken },
    dispatch,
  } = useGlobalStateContext();

  const [openLogin, setOpenLogin] = React.useState(false);
  const [token, setToken] = React.useState<string>(cachedToken ?? "");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  React.useEffect(() => {
    setToken(cachedToken ?? "");
  }, [cachedToken]);

  const onClickOpen = React.useCallback(() => {
    setOpenLogin(true);
  }, []);

  const onClose = React.useCallback(() => {
    setOpenLogin(false);
  }, []);

  const onChangeToken = React.useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      setToken(e?.target?.value ?? "");
    },
    []
  );

  const onChangeEmail = React.useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e?.target?.value ?? "");
    },
    []
  );

  const onChangePassword = React.useCallback(
    (e?: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e?.target?.value ?? "");
    },
    []
  );

  const onSubmitToken = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    dispatch({ type: "setToken", token: token });
    setOpenLogin(false);
  };

  const logout = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    dispatch({ type: "setToken", token: "" });
    dispatch({ type: "setLoggedInUser", user: undefined });
    setOpenLogin(false);
  };

  const onLogIn = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    const { access_token: token } = await logInUserWithPassword({
      username,
      password,
    });
    setPassword("");
    dispatch({ type: "setToken", token });
    setOpenLogin(false);
  };

  const isDev = window.location.origin.includes("localhost:8080");

  return (
    <>
      <Button onClick={onClickOpen}>
        {cachedToken && cachedToken !== "" ? user?.nickname : "Log in"}
      </Button>
      <Modal open={openLogin} onClose={onClose} size="small">
        {user && (
          <div
            className={css`
              margin: 0 0 1rem;
              display: flex;
              flex-direction: column;
            `}
          >
            <p className={pClass}>
              <strong>nickname: </strong> {user.nickname}
            </p>
            <p className={pClass}>
              <strong>credits: </strong> {user.credits}
            </p>
            <p className={pClass}>
              <strong>role: </strong> {user.role}
            </p>
          </div>
        )}
        {/** if the user is on the dev environment, we can't use the v1 api,
         * cause it requires CORS, but if they are in the app, then we can
         * use the API */}
        {(!cachedToken || cachedToken === "") && (
          <>
            {isDev && (
              <form className={formWrapper}>
                <label>
                  Because you're developing the app you need to log in with your
                  own <code>clientId</code>. You can copy it from any v2 API
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
        )}
        {cachedToken && <Button onClick={logout}>Log out</Button>}
      </Modal>
    </>
  );
};

export default Header;
