import React from "react";
import Button from "../common/Button";
import { useForm } from "react-hook-form";
import {
  addTracksToTrackGroup,
  createTrack,
  uploadTrackFile,
} from "services/api/User";
import { InputEl } from "../common/Input";
import { SelectEl } from "../common/Select";
import FormComponent from "components/common/FormComponent";
import { useSnackbar } from "contexts/SnackbarContext";
import LoadingSpinner from "components/common/LoadingSpinner";

export interface ShareableTrackgroup {
  creatorId: number;
  slug: string;
}

export const NewTrack: React.FC<{
  trackgroup: TrackgroupDetail;
  reload: () => Promise<void>;
}> = ({ trackgroup, reload }) => {
  const { register, handleSubmit } = useForm();
  const [isSaving, setIsSaving] = React.useState(false);
  const snackbar = useSnackbar();

  const doAddTrack = React.useCallback(
    async (data) => {
      try {
        setIsSaving(true);
        const track = await createTrack({
          ...data,
          creatorId: trackgroup.creatorId,
        });
        await uploadTrackFile(track.id, data);
        await addTracksToTrackGroup(trackgroup.id, {
          tracks: [
            {
              trackId: track.id,
            },
          ],
        });
        snackbar("Track uploaded", { type: "success" });
      } catch (e) {
        console.error(e);
        snackbar("There was a problem with the API", { type: "warning" });
      } finally {
        setIsSaving(false);
        await reload();
      }
    },
    [trackgroup.id, trackgroup.creatorId, reload, snackbar]
  );

  return (
    <form onSubmit={handleSubmit(doAddTrack)}>
      <h4>New Track</h4>
      <FormComponent>
        Title: <InputEl {...register("title")} />
      </FormComponent>
      <FormComponent>
        Status:{" "}
        <SelectEl defaultValue="paid" {...register("status")}>
          <option value="free+paid">Free + Paid</option>
          <option value="hidden">Hidden</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
          <option value="deleted">Deleted</option>
        </SelectEl>
      </FormComponent>

      <FormComponent>
        <InputEl
          type="file"
          id="audio"
          {...register("upload")}
          accept="audio/mpeg,audio/flac"
        />
      </FormComponent>
      <Button
        type="submit"
        disabled={isSaving}
        startIcon={isSaving ? <LoadingSpinner /> : undefined}
      >
        Add track
      </Button>
    </form>
  );
};

export default NewTrack;
