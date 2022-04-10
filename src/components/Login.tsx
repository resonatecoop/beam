import { css } from "@emotion/css";
import React from "react";

import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import Input from "./common/Input";
import Modal from "./common/Modal";

const formWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Header = () => {
  const {
    state: { user, token: cachedToken },
    dispatch,
  } = useGlobalStateContext();

  const [openLogin, setOpenLogin] = React.useState(false);
  const [token, setToken] = React.useState<string>(cachedToken ?? "");

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

  const onSubmitToken = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    dispatch({ type: "setToken", token: token });
    setOpenLogin(false);
  };

  return (
    <>
      <Button onClick={onClickOpen}>
        {cachedToken && cachedToken !== "" ? user?.nickname : "Log in"}
      </Button>
      <Modal open={openLogin} onClose={onClose} size="small">
        {user && (
          <div
            className={css`
              margin: 1rem 0;
            `}
          >
            <p>
              <strong>nickname: </strong> {user.nickname}
            </p>
            <p>
              <strong>credits: </strong> {user.credits}
            </p>
            <p>
              <strong>role: </strong> {user.role}
            </p>
          </div>
        )}
        <form className={formWrapper}>
          <label>Put in your token:</label>
          <Input name="token" value={token} onChange={onChangeToken} />
          <Button onClick={onSubmitToken}>Submit</Button>
        </form>
      </Modal>
    </>
  );
};

export default Header;
