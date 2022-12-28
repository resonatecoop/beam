import Button from "components/common/Button";
import FormComponent from "components/common/FormComponent";
import { InputEl } from "components/common/Input";
import LoadingSpinner from "components/common/LoadingSpinner";
import { SelectEl } from "components/common/Select";
import TextArea from "components/common/TextArea";
import { useSnackbar } from "contexts/SnackbarContext";
import { pick } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  AdminTrackGroup,
  fetchTrackGroup,
  updateTrackGroup,
} from "services/api/Admin";

export const TrackGroupDetails: React.FC = () => {
  const { trackgroupId } = useParams();
  const snackbar = useSnackbar();
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const [trackgroup, setTrackgroup] = React.useState<AdminTrackGroup>();

  const fetchTrackWrapper = React.useCallback(
    async (id: string) => {
      const fetchedTrackgroup = await fetchTrackGroup(id);
      setTrackgroup(fetchedTrackgroup);
      reset({
        ...fetchedTrackgroup,
      });
    },
    [reset]
  );

  React.useEffect(() => {
    if (trackgroupId) {
      fetchTrackWrapper(trackgroupId);
    }
  }, [fetchTrackWrapper, trackgroupId]);

  const doSave = React.useCallback(
    async (data) => {
      if (trackgroupId) {
        try {
          setIsLoading(true);
          await updateTrackGroup(
            trackgroupId,
            pick(
              data,
              "about",
              "private",
              "releaseDate",
              "enabled",
              "title",
              "type",
              "featured"
            )
          );
          snackbar("Successfully updated track group", { type: "success" });
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [trackgroupId, snackbar]
  );

  return (
    <>
      <h3>Track Group: {trackgroup?.title}</h3>
      <form onSubmit={handleSubmit(doSave)}>
        <FormComponent>
          Title: <InputEl {...register("title")} />
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
        <FormComponent style={{ display: "flex" }}>
          <input type="checkbox" id="private" {...register("private")} />
          <label htmlFor="private">
            Is private?
            <small>
              Private albums can not be listened to by Resonate users
            </small>
          </label>
        </FormComponent>
        <FormComponent style={{ display: "flex" }}>
          <input type="checkbox" id="enabled" {...register("enabled")} />
          <label htmlFor="enabled">
            Is enabled?
            <small>Enabled albums can be made public by the artist</small>
          </label>
        </FormComponent>
        <FormComponent style={{ display: "flex" }}>
          <input id="featured" type="checkbox" {...register("featured")} />
          <label htmlFor="featured">
            Is featured?
            <small>
              Featured albums will appear in featured lists on Resonate
            </small>
          </label>
        </FormComponent>

        <Button
          type="submit"
          style={{ marginTop: "1rem" }}
          disabled={isLoading}
          startIcon={isLoading ? <LoadingSpinner /> : undefined}
        >
          Save track group
        </Button>
      </form>
    </>
  );
};

export default TrackGroupDetails;
