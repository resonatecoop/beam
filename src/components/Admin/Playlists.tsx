import { css } from "@emotion/css";
import IconButton from "components/common/IconButton";
import Modal from "components/common/Modal";
import Table from "components/common/Table";
import React from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AdminPlaylist, fetchPlaylists } from "services/api/Admin";
import usePagination from "utils/usePagination";

export const AdminPlaylists: React.FC = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const [openModal, setOpenModal] = React.useState(false);

  const { LoadingButton, results } = usePagination<AdminPlaylist>({
    apiCall: React.useCallback(fetchPlaylists, []),
    options: React.useMemo(() => ({ limit: 50 }), []),
  });

  React.useEffect(() => {
    if (playlistId) {
      setOpenModal(true);
    }
  }, [playlistId]);

  const onClickEdit = React.useCallback(
    (id: string) => {
      navigate(`/admin/playlists/${id}`);
    },
    [navigate]
  );

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>Playlists</h3>
      {results.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Private?</th>
              <th>Featured?</th>
              <th>Creator</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {results.map((playlist) => (
              <tr key={playlist.id}>
                <td>{playlist.title}</td>
                <td>{playlist.private ? <FaCheck /> : undefined}</td>
                <td>{playlist.featured ? <FaCheck /> : undefined}</td>

                <td>{playlist.creator?.displayName}</td>
                <td className="alignRight">
                  <IconButton compact onClick={() => onClickEdit(playlist.id)}>
                    <FaEdit />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {results.length === 0 && <>No playlists exist yet</>}
      <LoadingButton />
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          navigate("/admin/playlists");
        }}
      >
        <Outlet />
      </Modal>
    </div>
  );
};

export default AdminPlaylists;
