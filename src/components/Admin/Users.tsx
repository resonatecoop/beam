import { css } from "@emotion/css";
import IconButton from "components/common/IconButton";
import Modal from "components/common/Modal";
import Table from "components/common/Table";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AdminUser, fetchUsers } from "services/api/Admin";
import usePagination from "utils/usePagination";

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [openModal, setOpenModal] = React.useState(false);
  const { LoadingButton, results } = usePagination<AdminUser>({
    apiCall: React.useCallback(fetchUsers, []),
    options: React.useMemo(() => ({ limit: 50 }), []),
  });

  React.useEffect(() => {
    if (userId) {
      setOpenModal(true);
    }
  }, [userId]);

  const onClickQueue = React.useCallback(
    (id: string) => {
      navigate(`/admin/users/${id}`);
    },
    [navigate]
  );

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>Users</h3>
      {results.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Display name</th>
              <th>Email</th>
              <th>Email confirmed?</th>
              <th>Full name</th>
              <th>Member</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>{user.emailConfirmed}</td>
                <td>{user.fullName}</td>
                <td>{user.member}</td>
                <td>{user.role.name}</td>
                <td className="alignRight">
                  <IconButton compact onClick={() => onClickQueue(user.id)}>
                    <FaEdit />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <LoadingButton />
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          navigate("/admin/users");
        }}
      >
        <Outlet />
      </Modal>
    </div>
  );
};

export default AdminUsers;
