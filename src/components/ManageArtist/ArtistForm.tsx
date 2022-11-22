import React from "react";
import Modal from "components/common/Modal";
import Button from "../common/Button";
import { useForm } from "react-hook-form";
import { createUserArtist, updateUserArtist } from "services/api/User";
import { InputEl } from "../common/Input";
import LoadingSpinner from "components/common/LoadingSpinner";
import FormComponent from "components/common/FormComponent";
import TextArea from "components/common/TextArea";
import { css } from "@emotion/css";
import { useSnackbar } from "contexts/SnackbarContext";
import { pick } from "lodash";
import UploadArtistImage from "./UploadArtistImage";

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
  const snackbar = useSnackbar();
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
            ...pick(data, ["shortBio", "description", "displayName", "email"]),
          });
        } else {
          await createUserArtist({
            ...pick(data, ["shortBio", "description", "displayName", "email"]),
          });
        }

        await reload();
        if (!existingId) {
          onClose();
        }
        snackbar("Updated artist", { type: "success" });
      } catch (e) {
        console.error(e);
        snackbar("Something went wrong with the API", { type: "warning" });
      } finally {
        setIsSaving(false);
      }
    },
    [reload, onClose, existingId, snackbar]
  );

  return (
    <Modal open={open} onClose={onClose} size="small">
      <form onSubmit={handleSubmit(soSave)}>
        {existing && (
          <UploadArtistImage
            existing={existing}
            reload={reload}
            imageType="banner"
            height="125px"
            width="100%"
            maxDimensions="2500x500"
          />
        )}
        {existing && (
          <UploadArtistImage
            existing={existing}
            reload={reload}
            imageType="avatar"
            height="120px"
            width="120px"
            maxDimensions="1500x1500"
          />
        )}

        <div
          className={css`
            margin-top: 1rem;
          `}
        >
          <h3>{existing ? existing.displayName : "New artist"}</h3>
          <FormComponent>
            Display name: <InputEl {...register("displayName")} />
          </FormComponent>
          <FormComponent>
            Bio:
            <TextArea {...register("shortBio")} />
          </FormComponent>
          <FormComponent>
            Description:
            <TextArea {...register("description")} />
          </FormComponent>
          <FormComponent>
            Email: <InputEl type="email" {...register("email")} />
          </FormComponent>

          <Button
            type="submit"
            disabled={isSaving}
            startIcon={isSaving ? <LoadingSpinner /> : undefined}
          >
            {existing ? "Save" : "Create"} artist
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ArtistForm;
