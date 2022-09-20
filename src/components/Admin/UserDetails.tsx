import Tabs from "components/common/Tabs";
import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { AdminUser, fetchUser } from "services/api/Admin";

export const UserDetails: React.FC = () => {
  const { userId } = useParams();

  const [user, setUser] = React.useState<AdminUser>();

  const fetchUserWrapper = React.useCallback(async (id: string) => {
    const fetchedUser = await fetchUser(id);
    setUser(fetchedUser);
  }, []);

  React.useEffect(() => {
    if (userId) {
      fetchUserWrapper(userId);
    }
  }, [fetchUserWrapper, userId]);

  return (
    <>
      <h3>User: {user?.displayName}</h3>
      <Tabs>
        <li>
          <NavLink to="">Details</NavLink>
        </li>
        <li>
          <NavLink to="releases">Releases</NavLink>
        </li>
        <li>
          <NavLink to="analytics">Releases</NavLink>
        </li>
        <li>
          <NavLink to="earnings">Earnings</NavLink>
        </li>
      </Tabs>
      <Outlet context={[user]} />
    </>
  );
};

export default UserDetails;
