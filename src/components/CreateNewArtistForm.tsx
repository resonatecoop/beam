import React from "react";
import Modal from "components/common/Modal";
import Button from "./common/Button";
import { useForm } from "react-hook-form";
import { createUserArtist } from "services/Api";
import { InputEl } from "./common/Input";

export interface ShareableTrackgroup {
  creator_id: number;
  slug: string;
}

export const CreateNewArtistForm: React.FC<{
  open: boolean;
  onClose: () => void;
  reload: () => Promise<void>;
}> = ({ open, onClose, reload }) => {
  const { register, handleSubmit } = useForm();

  const doAddArtist = React.useCallback(
    async (data) => {
      await createUserArtist({
        ...data,
      });

      await reload();
      onClose();
    },
    [reload, onClose]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(doAddArtist)}>
        <h3>New artist</h3>
        <div>
          Title: <InputEl {...register("display_name")} />
        </div>
        <Button type="submit">Add artist</Button>
      </form>
    </Modal>
  );
};

export default CreateNewArtistForm;
