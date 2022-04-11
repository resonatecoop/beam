import React from "react";
import { FaPlus } from "react-icons/fa";
import { createTrackGroup } from "../services/Api";
import IconButton from "./common/IconButton";
import InlineForm from "./common/InlineForm";
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
    <InlineForm>
      <Input
        name="newPlaylistName"
        placeholder="New playlist name"
        value={newPlaylistName}
        onChange={onChange}
      />
      <IconButton onClick={onAddPlaylist}>
        <FaPlus />
      </IconButton>
    </InlineForm>
  );
};

export default AddPlaylist;
