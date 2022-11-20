import React from "react";

import {
  createTrackGroup,
  updateTrackGroup,
  uploadTrackGroupCover,
} from "services/api/User";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import { InputEl } from "../common/Input";
import { SelectEl } from "../common/Select";
import TextArea from "../common/TextArea";
import FormComponent from "components/common/FormComponent";
import { useSnackbar } from "contexts/SnackbarContext";
import { pick } from "lodash";
import { css } from "@emotion/css";
import LoadingSpinner from "components/common/LoadingSpinner";

const AlbumForm: React.FC<{
  existing?: Trackgroup;
  reload: () => Promise<void>;
  artist: Artist;
  onClose?: () => void;
}> = ({ reload, artist, existing, onClose }) => {
  const snackbar = useSnackbar();
  const [isSaving, setIsSaving] = React.useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: existing ?? {
      private: true,
    },
  });

  const existingId = existing?.id;
  const doSave = React.useCallback(
    async (data: {
      title: string;
      private: boolean;
      type: string;
      releaseDate: string;
      about: string;
      cover: string | File[];
    }) => {
      try {
        setIsSaving(true);
        let savedId = existingId;
        if (existingId) {
          await updateTrackGroup(existingId, {
            ...pick(data, ["title", "private", "type", "releaseDate", "about"]),
          });
        } else {
          const newGroup = await createTrackGroup({
            ...pick(data, ["title", "private", "type", "releaseDate", "about"]),
            artistId: artist.id,
          });
          savedId = newGroup.id;
        }
        // data cover is a string if the form hasn't been changed.
        if (savedId && data.cover[0] && typeof data.cover[0] !== "string") {
          await uploadTrackGroupCover(savedId, data.cover[0]);
        }
        snackbar("Trackgroup updated", { type: "success" });
        onClose?.();
      } catch (e) {
        snackbar("There was a problem with the API", { type: "warning" });
      } finally {
        setIsSaving(false);
        await reload();
      }
    },
    [reload, existingId, snackbar, artist.id, onClose]
  );

  return (
    <form onSubmit={handleSubmit(doSave)}>
      <h4>
        {existing ? "Edit" : "New"} Album for {artist.displayName}
      </h4>

      {/* <FormComponent>
        Display artist: <InputEl {...register("display_artist")} />
      </FormComponent> */}
      <FormComponent>
        Title: <InputEl {...register("title")} />
      </FormComponent>
      <FormComponent
        className={css`
          margin-top: 0.5rem;
          display: flex;
        `}
      >
        <input id="private" type="checkbox" {...register("private")} />{" "}
        <label
          className={css`
            display: flex;
            flex-direction: column;
            margin-left: 0.5rem;
          `}
          htmlFor="private"
        >
          Is private?
          <small>Private albums can not be listened to by Resonate users</small>
        </label>
      </FormComponent>
      <FormComponent
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        Cover:
        {existing?.images && (
          <img src={existing.images.small?.url} alt="album cover" />
        )}
      </FormComponent>
      <FormComponent>
        <InputEl
          type="file"
          id="audio"
          {...register("cover")}
          accept="image/*"
        />
      </FormComponent>
      <FormComponent>
        Type:{" "}
        <SelectEl defaultValue="lp" {...register("type")}>
          <option value="lp">LP</option>
          <option value="ep">EP</option>
        </SelectEl>
      </FormComponent>
      <FormComponent>
        Release date: <InputEl type="date" {...register("releaseDate")} />
      </FormComponent>
      <FormComponent>
        About: <TextArea {...register("about")} />
      </FormComponent>
      <Button
        type="submit"
        disabled={isSaving}
        startIcon={isSaving ? <LoadingSpinner /> : undefined}
      >
        {existing ? "Save" : "Submit"} Album
      </Button>
    </form>
  );
};

export default AlbumForm;
