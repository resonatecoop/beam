import { css } from "@emotion/css";
import Button from "components/common/Button";
import Table from "components/common/Table";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { fetchUserTrackGroup } from "services/api/User";
import ManageAlbumForm from "./ManageAlbumForm";
import NewAlbumForm from "./NewAlbumForm";

const ArtistListItem: React.FC<{
  artist: Artist;
  reload: () => Promise<void>;
}> = ({ artist, reload }) => {
  const [manageTrackgroup, setManageTrackgroup] =
    React.useState<TrackgroupDetail>();
  const [addingNewAlbum, setAddingNewAlbum] = React.useState(false);

  const albumId = manageTrackgroup?.id;

  const reloadWrapper = React.useCallback(async () => {
    if (albumId) {
      const tg = await fetchUserTrackGroup(albumId);
      setManageTrackgroup(tg);
    }
    await reload();
  }, [albumId, reload]);

  return (
    <div
      key={artist.id}
      className={css`
        margin-bottom: 2rem;
      `}
    >
      <h4>{artist.displayName}</h4>

      <h5>Your albums</h5>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Display artist</th>
            <th className="alignRight">Private</th>
            <th className="alignRight">Enabled</th>
            <th className="alignRight">Tracks</th>
            <th className="alignRight">Release date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {artist.trackgroups?.map((album) => (
            <tr key={album.id}>
              <td>{album.title}</td>
              <td>{artist.displayName}</td>
              <td className="alignRight">{album.private ? <FaCheck /> : ""}</td>
              <td className="alignRight">{album.enabled ? <FaCheck /> : ""}</td>
              <td className="alignRight">{album.items.length}</td>
              <td className="alignRight">{album.releaseDate}</td>

              <td className="alignRight">
                <Button
                  compact
                  onClick={() => {
                    setManageTrackgroup(album);
                  }}
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {manageTrackgroup && (
        <ManageAlbumForm
          open={!!manageTrackgroup}
          trackgroup={manageTrackgroup}
          onClose={() => setManageTrackgroup(undefined)}
          reload={reloadWrapper}
          artist={artist}
        />
      )}
      <Button
        onClick={() => {
          setAddingNewAlbum(true);
        }}
        style={{ marginTop: "1rem" }}
      >
        Add new album to {artist.displayName}
      </Button>
      <NewAlbumForm
        open={addingNewAlbum}
        onClose={() => setAddingNewAlbum(false)}
        reload={reload}
        artist={artist}
      />
    </div>
  );
};

export default ArtistListItem;
