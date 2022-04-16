import React from "react";
import { css } from "@emotion/css";
import { useGlobalStateContext } from "../contexts/globalState";
import Button from "./common/Button";
import Disclaimer from "./common/Disclaimer";
import { fetchuserStats } from "../services/Api";
import { format, subDays, differenceInDays, addDays } from "date-fns";

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
    state: { user, token: cachedToken },
    dispatch,
  } = useGlobalStateContext();
  const [stats, setStats] = React.useState<{ date: string; plays: Number }[]>(
    []
  );
  const date = new Date();
  const start = subDays(date, 7);
  const end = date;

  const logout = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    dispatch({ type: "setToken", token: "" });
    dispatch({ type: "setLoggedInUser", user: undefined });
  };

  const fetchStats = React.useCallback(async () => {
    const stats = await fetchuserStats(
      format(start, formatStr),
      format(end, formatStr)
    );
    const days = differenceInDays(end, start);
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
  }, [start, end]);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      {cachedToken && <Button onClick={logout}>Log out</Button>}

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
    </div>
  );
};

export default Profile;
