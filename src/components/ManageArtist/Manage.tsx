import { css } from "@emotion/css";
import React from "react";

import BackButton from "../common/BackButton";
import { fetchUserArtists } from "services/api/User";
import NewAlbumForm from "./NewAlbumForm";
import Button from "../common/Button";
import ManageAlbumForm from "./ManageAlbumForm";
import Table from "../common/Table";
import { FaCheck } from "react-icons/fa";
import CreateNewArtistForm from "../CreateNewArtistForm";

export const Manage: React.FC = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [addingTrackToAlbum, setAddingTrackToAlbum] =
    React.useState<TrackgroupDetail>();
  const [creatingNewArtist, setCreatingNewArtist] = React.useState(false);
  const [addingNewAlbum, setAddingNewAlbum] = React.useState(false);

  const fetchArtists = React.useCallback(async () => {
    const fetchedArtists = await fetchUserArtists();
    if (fetchedArtists) {
      setArtists(fetchedArtists.data);
    }
  }, []);

  React.useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <>
      <div
        className={css`
          z-index: 1;
          top: calc(48px + 3rem);
          left: 0;
          overflow-x: hidden;
          padding: 0 0 1rem 1rem;
        `}
      >
        <BackButton />

        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: space-between;

            button {
              margin-top: 0 !important;
            }
          `}
        >
          <h2 className={css``}>Manage</h2>
          <Button
            onClick={() => {
              setCreatingNewArtist(true);
            }}
            style={{ marginTop: "1rem" }}
          >
            Create new artist
          </Button>
          <CreateNewArtistForm
            open={creatingNewArtist}
            onClose={() => setCreatingNewArtist(false)}
            reload={fetchArtists}
          />
        </div>
        <h3>Your artists</h3>

        {artists.map((a) => (
          <div
            key={a.id}
            className={css`
              margin-bottom: 2rem;
            `}
          >
            <h4>{a.displayName}</h4>

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
                {a.trackgroups?.map((album) => (
                  <tr key={album.id}>
                    <td>{album.title}</td>
                    <td>{album.display_artist}</td>
                    <td className="alignRight">
                      {album.private ? <FaCheck /> : ""}
                    </td>
                    <td className="alignRight">
                      {album.enabled ? <FaCheck /> : ""}
                    </td>
                    <td className="alignRight">{album.items.length}</td>
                    <td className="alignRight">{album.release_date}</td>

                    <td className="alignRight">
                      <Button
                        compact
                        onClick={() => {
                          setAddingTrackToAlbum(album);
                        }}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {addingTrackToAlbum && (
              <ManageAlbumForm
                open={!!addingTrackToAlbum}
                trackgroup={addingTrackToAlbum}
                onClose={() => setAddingTrackToAlbum(undefined)}
                reload={fetchArtists}
                artist={a}
              />
            )}
            <Button
              onClick={() => {
                setAddingNewAlbum(true);
              }}
              style={{ marginTop: "1rem" }}
            >
              Add new album to {a.displayName}
            </Button>
            <NewAlbumForm
              open={addingNewAlbum}
              onClose={() => setAddingNewAlbum(false)}
              reload={fetchArtists}
              artist={a}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Manage;
