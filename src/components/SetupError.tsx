import styled from "@emotion/styled";
import React from "react";
import { oidcConfig } from "auth/config";

const News = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.warning};
  color: white;
  text-align: center;
  font-size: 1rem;
  padding: 1rem;
  position: relative;
`;

export const SetupError = () => {
  const [warning, setWarning] = React.useState<string | React.ReactElement>();

  const fetchNews = async () => {
    if (
      !oidcConfig.clientId ||
      oidcConfig.clientId === "" ||
      !oidcConfig.clientSecret ||
      oidcConfig.clientSecret === ""
    ) {
      setWarning(
        <>
          You need to set <strong>REACT_APP_CLIENT_SECRET</strong> and{" "}
          <strong>REACT_APP_CLIENT_ID</strong> in <code>.env.local</code>{" "}
          otherwise you will not be able to log in or register plays
        </>
      );
    }
  };

  React.useEffect(() => {
    fetchNews();
  }, []);

  if (!warning || warning === "") {
    return null;
  }

  return <News>{warning}</News>;
};

export default SetupError;
