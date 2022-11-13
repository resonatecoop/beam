import Button from "components/common/Button";
import { InputEl } from "components/common/Input";
import LoadingSpinner from "components/common/LoadingSpinner";
import { SelectEl } from "components/common/Select";
import TextArea from "components/common/TextArea";
import { useSnackbar } from "contexts/SnackbarContext";
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
          await updateTrackGroup(trackgroupId, data);
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
          About:
          <InputEl {...register("about")} />
        </div>
        <div>
          Release date: <InputEl type="date" {...register("releaseDate")} />
        </div>
        <div>
          About: <TextArea {...register("about")} />
        </div>
        <div>
          Private?:
          <input type="checkbox" {...register("private")} />
        </div>
        <div>
          Enabled?:
          <input type="checkbox" {...register("enabled")} />
        </div>

        <Button
          type="submit"
          style={{ marginTop: "1rem" }}
          startIcon={isLoading ? <LoadingSpinner /> : undefined}
        >
          Save track grup
        </Button>
      </form>
    </>
  );
};

export default TrackGroupDetails;
