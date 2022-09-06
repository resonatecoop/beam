import React from "react";
import { css } from "@emotion/css";
import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import Disclaimer from "./common/Disclaimer";
import { fetchUserStats } from "services/api/User";
import { format, subDays, differenceInDays, addDays } from "date-fns";
import { useAuth } from "auth";
import { useNavigate } from "react-router-dom";

import beamPackage from "../../package.json";
import ManageAccount from "./ManageAccount";

const pClass = css`
  display: flex;
  margin: 0.5rem 0;
  padding-bottom: 0.25rem;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;

const formatStr = "yyyy-MM-dd";

const Profile: React.FC = () => {
  const {
    state: { user },
    dispatch,
  } = useGlobalStateContext();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [stats, setStats] = React.useState<{ date: string; plays: Number }[]>(
    []
  );
  const [date] = React.useState(new Date());

  const logout = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    signOut();
    dispatch({
      type: "setValuesDirectly",
      values: {
        user: undefined,
      },
    });
  };

  const fetchStats = React.useCallback(async () => {
    const start = subDays(date, 7);
    const stats = await fetchUserStats(
      format(start, formatStr),
      format(date, formatStr)
    );
    const days = differenceInDays(date, start);
    const dates = [];
    for (let i = 0; i < days; i++) {
      dates.push({
        date: format(addDays(start, i), formatStr),
        plays:
          stats.find((s) => s.date === format(addDays(start, i), formatStr))
            ?.plays ?? 0,
      });
    }
    setStats(dates);
  }, [date]);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const toggleDarkMode = async () => {
    if (window.darkMode) {
      const isDarkMode = window.darkMode.toggle();
      const themeSource = document.getElementById("theme-source");
      if (document && themeSource && "innerHTML" in themeSource) {
        themeSource.innerHTML = isDarkMode ? "Dark" : "Light";
      }
    }
  };

  const resetToSystem = async () => {
    window.darkMode?.system();
    const themeSource = document.getElementById("theme-source");
    if (document && themeSource && "innerHTML" in themeSource) {
      themeSource.innerHTML = "System";
    }
  };

  React.useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div
      className={css`
        margin: 0 auto;
        max-width: 820px;
      `}
    >
      {window.darkMode && (
        <>
          <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
          <Button onClick={resetToSystem}>Reset to System Theme</Button>
        </>
      )}
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
          <div className={pClass} style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>credits: </strong> {user.credit.total}
            </div>
            <small style={{ textAlign: "right" }}>
              Want to add credits to your account? Use{" "}
              <a href="https://id.resonate.coop/account?login_redirect_uri=%2Fweb%2Faccount">
                the web app.
              </a>
            </small>
          </div>
          <p className={pClass}>
            <strong>role: </strong> {user.role.name}
          </p>
        </div>
      )}
      <ManageAccount />
      <Button onClick={logout}>Log out</Button>
      <div
        className={css`
          margin-top: 2rem;
        `}
      >
        <h3>Play History</h3>
        {stats.map((s) => (
          <div key={s.date} className={pClass}>
            <dt>{s.date}</dt>
            <dd>{s.plays}</dd>
          </div>
        ))}
      </div>
      <Disclaimer />
      Beam version: {beamPackage.version}
    </div>
  );
};

export default Profile;
