import { css } from "@emotion/css";
import React from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { updateTrackGroup } from "../services/Api";
import Button from "./common/Button";
import Input from "./common/Input";

const PlaylistTitleEditing: React.FC<{
  playlist: Trackgroup;
  onDone: () => void;
}> = ({ playlist, onDone }) => {
  const [playlistTitle, setPlaylistTitle] = React.useState(playlist.title);
  const [isPrivate, setPrivate] = React.useState(playlist.private);

  const onChangeTitle = React.useCallback((e) => {
    setPlaylistTitle(e.target.value);
  }, []);

  const onSave = React.useCallback(
    async (e) => {
      await updateTrackGroup(playlist.id, {
        cover: playlist.cover_metadata.id,
        tags: playlist.tags,
        type: "playlist",
        private: isPrivate,
        title: playlistTitle,
      });
      onDone();
    },
    [playlist, playlistTitle, onDone, isPrivate]
  );

  const togglePrivate = () => {
    setPrivate((v) => !v);
  };

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        > input {
          margin-bottom: 0;
          margin-right: 1rem;
          margin-left: 1rem;
        }

        > button {
          padding: 0.5rem 1rem;
        }
      `}
    >
      <Button
        onClick={togglePrivate}
        endIcon={isPrivate ? <FaUnlock /> : <FaUnlock />}
      >
        {!isPrivate && <>Make private</>}
        {isPrivate && <>Make public</>}
      </Button>
      <Input value={playlistTitle} onChange={onChangeTitle} name="title" />
      <Button onClick={onSave}>Save</Button>
    </div>
  );
};

export default PlaylistTitleEditing;
