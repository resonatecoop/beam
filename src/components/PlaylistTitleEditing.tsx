import { css } from "@emotion/css";
import React from "react";
import { updateTrackGroup } from "../services/Api";
import Button from "./common/Button";
import Input from "./common/Input";
import TextArea from "./common/TextArea";

const PlaylistTitleEditing: React.FC<{
  playlist: Trackgroup;
  onDone: () => void;
}> = ({ playlist, onDone }) => {
  const [playlistTitle, setPlaylistTitle] = React.useState(playlist.title);
  const [about, setAbout] = React.useState(playlist.about ?? "");
  const [isPrivate, setPrivate] = React.useState(playlist.private);

  const onChangeTitle = React.useCallback((e) => {
    setPlaylistTitle(e.target.value);
  }, []);

  const onChangeAbout = React.useCallback((e) => {
    setAbout(e.target.value);
  }, []);

  const onSave = React.useCallback(
    async (e) => {
      await updateTrackGroup(playlist.id, {
        cover: playlist.cover_metadata.id,
        tags: playlist.tags,
        type: "playlist",
        private: isPrivate,
        title: playlistTitle,
        about,
      });
      onDone();
    },
    [playlist, playlistTitle, onDone, isPrivate, about]
  );

  const togglePrivate = () => {
    setPrivate((v) => !v);
  };

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          margin-bottom: 1rem;

          > input:not([type="checkbox"]) {
            margin-bottom: 0;
            margin-right: 1rem;
          }

          > div {
            padding: 0.5rem 1rem;
            min-width: 140px;
            text-align: right;
          }
        `}
      >
        <Input value={playlistTitle} onChange={onChangeTitle} name="title" />
        <div>
          <label>is private? </label>
          <input type="checkbox" checked={isPrivate} onChange={togglePrivate} />
        </div>
      </div>
      <TextArea
        value={about}
        className={css`
          margin-bottom: 1rem;
        `}
        onChange={onChangeAbout}
      ></TextArea>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
        `}
      >
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default PlaylistTitleEditing;
