import React from "react";
import Modal from "components/common/Modal";
import Button from "../common/Button";
import { useForm } from "react-hook-form";
import { createUserArtist, updateUserArtist } from "services/api/User";
import { InputEl } from "../common/Input";
import LoadingSpinner from "components/common/LoadingSpinner";

export interface ShareableTrackgroup {
  creatorId: number;
  slug: string;
}

export const ArtistForm: React.FC<{
  existing?: Artist;
  open: boolean;
  onClose: () => void;
  reload: () => Promise<void>;
}> = ({ open, onClose, reload, existing }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: existing,
  });

  const existingId = existing?.id;

  const soSave = React.useCallback(
    async (data) => {
      try {
        setIsSaving(true);
        if (existingId) {
          await updateUserArtist(existingId, {
            ...data,
          });
        } else {
          await createUserArtist({
            ...data,
          });
        }

        await reload();
        if (!existingId) {
          onClose();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSaving(false);
      }
    },
    [reload, onClose, existingId]
  );

  return (
    <Modal open={open} onClose={onClose} size="small">
      <form onSubmit={handleSubmit(soSave)}>
        <h3>{existing ? existing.displayName : "New artist"}</h3>
        <div>
          Title: <InputEl {...register("displayName")} />
        </div>
        <Button
          type="submit"
          disabled={isSaving}
          startIcon={isSaving ? <LoadingSpinner /> : undefined}
        >
          Add artist
        </Button>
      </form>
    </Modal>
  );
};

export default ArtistForm;
