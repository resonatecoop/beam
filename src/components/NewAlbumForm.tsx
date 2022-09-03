import React from "react";

import { createTrackGroup } from "services/Api";
import { useForm } from "react-hook-form";
import Button from "./common/Button";
import { InputEl } from "./common/Input";
import { SelectEl } from "./common/Select";
import TextArea from "./common/TextArea";
import Modal from "./common/Modal";

const NewAlbumForm: React.FC<{
  open: boolean;
  onClose: () => void;
  reload: () => Promise<void>;
  artist: Artist;
}> = ({ reload, artist, open, onClose }) => {
  const { register, handleSubmit } = useForm();
  const doSave = React.useCallback(
    async (data) => {
      await createTrackGroup({
        ...data,
        artistId: artist.id,
        cover: "4903e433-f429-4ad1-9ab2-5ba962acbbd1",
      });
      reload();
    },
    [reload, artist.id]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(doSave)}>
        <h4>New Album for {artist.display_name}</h4>
        <div>
          Display artist: <InputEl {...register("display_artist")} />
        </div>
        <div>
          Title: <InputEl {...register("title")} />
        </div>
        <div>
          Type:{" "}
          <SelectEl defaultValue="lp" {...register("type")}>
            <option value="lp">LP</option>
            <option value="ep">EP</option>
          </SelectEl>
        </div>
        <div>
          Release date: <InputEl type="date" {...register("release_date")} />
        </div>
        <div>
          About: <TextArea {...register("about")} />
        </div>
        <div></div>
        <Button type="submit">Submit Album</Button>
      </form>
    </Modal>
  );
};

export default NewAlbumForm;
