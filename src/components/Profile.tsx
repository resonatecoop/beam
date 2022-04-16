import React from "react";
import { css } from "@emotion/css";
import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import Disclaimer from "./common/Disclaimer";

const pClass = css`
  display: flex;
  margin: 0.5rem 0;
  padding-bottom: 0.25rem;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;

const Profile: React.FC = () => {
  const {
    state: { user, token: cachedToken },
    dispatch,
  } = useGlobalStateContext();

  const logout = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    dispatch({ type: "setToken", token: "" });
    dispatch({ type: "setLoggedInUser", user: undefined });
  };

  return (
    <div
      className={css`
        margin: 0 auto;
        max-width: 820px;
      `}
    >
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
          <p className={pClass} style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>credits: </strong> {user.credits}
            </div>
            <small style={{ textAlign: "right" }}>
              Want to add credits to your account? Use{" "}
              <a href="https://stream.resonate.coop/discover">the web app.</a>
            </small>
          </p>
          <p className={pClass}>
            <strong>role: </strong> {user.role}
          </p>
        </div>
      )}
      <Disclaimer />
      {cachedToken && <Button onClick={logout}>Log out</Button>}
    </div>
  );
};

export default Profile;
