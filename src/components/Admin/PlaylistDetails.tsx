import Button from "components/common/Button";
import FormComponent from "components/common/FormComponent";
import { InputEl } from "components/common/Input";
import LoadingSpinner from "components/common/LoadingSpinner";
import TextArea from "components/common/TextArea";
import { useSnackbar } from "contexts/SnackbarContext";
import { pick } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  AdminPlaylist,
  fetchPlaylist,
  updatePlaylist,
} from "services/api/Admin";

export const PlaylistDetails: React.FC = () => {
  const { playlistId } = useParams();
  const snackbar = useSnackbar();
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const [trackgroup, setTrackgroup] = React.useState<AdminPlaylist>();

  const fetchTrackWrapper = React.useCallback(
    async (id: string) => {
      const fetchedTrackgroup = await fetchPlaylist(id);
      setTrackgroup(fetchedTrackgroup);
      reset({
        ...fetchedTrackgroup,
      });
    },
    [reset]
  );

  React.useEffect(() => {
    if (playlistId) {
      fetchTrackWrapper(playlistId);
    }
  }, [fetchTrackWrapper, playlistId]);

  const doSave = React.useCallback(
    async (data) => {
      if (playlistId) {
        try {
          setIsLoading(true);
          await updatePlaylist(
            playlistId,
            pick(data, ["title", "about", "private", "featured"])
          );
          snackbar("Successfully updated track group", { type: "success" });
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [playlistId, snackbar]
  );

  return (
    <>
      <h3>Playlist: {trackgroup?.title}</h3>
      <form onSubmit={handleSubmit(doSave)}>
        <FormComponent>
          Title: <InputEl {...register("title")} />
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
          Save playlist
        </Button>
      </form>
    </>
  );
};

export default PlaylistDetails;
