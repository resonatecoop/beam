import React from "react";
import { css } from "@emotion/css";
import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import Disclaimer from "./common/Disclaimer";
import { fetchUserStats } from "services/api/User";
import { format, subDays, differenceInDays, addDays } from "date-fns";
import { useAuth } from "oidc-react";
import { Link, useNavigate } from "react-router-dom";

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
  const [openAccount, setOpenAccount] = React.useState(false);

  const { signOut, userManager } = useAuth();
  const [stats, setStats] = React.useState<{ date: string; plays: Number }[]>(
    []
  );
  const [date] = React.useState(new Date());

  const logout = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    signOut();
    userManager.signoutPopup();
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
    for (let i = 0; i < days + 1; i++) {
      const today = addDays(start, i);
      const todayFormatted = format(today, formatStr);
      dates.push({
        date: todayFormatted,
        plays: stats.find((s) => s.date === todayFormatted)?.count ?? 0,
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

  const userIsArtist =
    (user?.userGroups?.length ?? 0) !== 0 || user?.role?.name === "artist";

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
            <strong>Display name: </strong> {user.displayName}
          </p>
          <div className={pClass} style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>credits: </strong>{" "}
              {user.credit?.total
                ? (user.credit.total / 1000).toFixed(4)
                : "None"}
            </div>
            <small style={{ textAlign: "right" }}>
              Want to add credits to your account? Go to{" "}
              <Button variant="link" onClick={() => setOpenAccount(true)}>
                manage your account
              </Button>
              .
            </small>
          </div>
          <p className={pClass}>
            <strong>role: </strong> {user.role.name}
          </p>
        </div>
      )}
      {userIsArtist && (
        <Link to="/manage">
          <Button onClick={() => setOpenAccount(true)}>Manage Artists</Button>
        </Link>
      )}
      <Button onClick={() => setOpenAccount(true)}>Manage Account</Button>
      <ManageAccount open={openAccount} onClose={() => setOpenAccount(false)} />
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
