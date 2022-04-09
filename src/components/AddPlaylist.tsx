import { css } from "@emotion/css";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { createTrackGroup } from "../services/Api";
import IconButton from "./common/IconButton";
import Input from "./common/Input";

export const AddPlaylist: React.FC = () => {
  const [newPlaylistName, setNewPlaylistName] = React.useState<string>("");

  const onChange = React.useCallback((e) => {
    setNewPlaylistName(e.target.value ?? "");
  }, []);

  const onAddPlaylist = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      await createTrackGroup({
        // FIXME: the POST trackgroup API endpoint requires a cover id,
        // which doesn't really make sense in this flow.
        cover: "4903e433-f429-4ad1-9ab2-5ba962acbbd1",
        title: newPlaylistName,
        type: "playlist",
      });
    },
    [newPlaylistName]
  );

  return (
    <form
      className={css`
        display: flex;
        margin-bottom: 1rem;
      `}
    >
      <Input
        name="newPlaylistName"
        placeholder="New playlist name"
        value={newPlaylistName}
        onChange={onChange}
        className={css`
          margin-bottom: 0rem;
          width: 100%;
        `}
      />
      <IconButton
        onClick={onAddPlaylist}
        className={css`
          border: 1px solid #dfdfdf;
          border-left: none;
        `}
      >
        <FaPlus />
      </IconButton>
    </form>
  );
};

export default AddPlaylist;
