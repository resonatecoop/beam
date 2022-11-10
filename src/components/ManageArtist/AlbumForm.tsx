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

const AlbumForm: React.FC<{
  existing?: Trackgroup;
  reload: () => Promise<void>;
  artist: Artist;
}> = ({ reload, artist, existing }) => {
  const snackbar = useSnackbar();

  const { register, handleSubmit } = useForm({
    defaultValues: existing,
  });

  const existingId = existing?.id;
  const doSave = React.useCallback(
    async (data) => {
      try {
        let savedId = existingId;
        if (existingId) {
          await updateTrackGroup(existingId, {
            ...pick(data, [
              "display_artist",
              "title",
              "type",
              "release_date",
              "about",
            ]),
          });
        } else {
          const newGroup = await createTrackGroup({
            ...data,
            artistId: artist.id,
          });
          savedId = newGroup.id;
        }
        if (savedId && data.cover[0]) {
          await uploadTrackGroupCover(savedId, data.cover[0]);
        }
        reload();
        snackbar("Trackgroup updated", { type: "success" });
      } catch (e) {
        snackbar("There was a problem with the API", { type: "warning" });
      }
    },
    [reload, existingId, snackbar, artist.id]
  );

  return (
    <form onSubmit={handleSubmit(doSave)}>
      <h4>
        {existing ? "Edit" : "New"} Album for {artist.displayName}
      </h4>

      <FormComponent>
        Display artist: <InputEl {...register("display_artist")} />
      </FormComponent>
      <FormComponent>
        Title: <InputEl {...register("title")} />
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
        Release date: <InputEl type="date" {...register("release_date")} />
      </FormComponent>
      <FormComponent>
        About: <TextArea {...register("about")} />
      </FormComponent>
      <Button type="submit">{existing ? "Save" : "Submit"} Album</Button>
    </form>
  );
};

export default AlbumForm;
