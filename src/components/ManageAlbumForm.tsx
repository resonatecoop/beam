import React from "react";
import Modal from "components/common/Modal";
import Button from "./common/Button";
import { useForm } from "react-hook-form";
import {
  addTracksToTrackGroup,
  createTrack,
  uploadTrackFile,
} from "services/Api";
import TrackTable from "./common/TrackTable";
import { InputEl } from "./common/Input";

export interface ShareableTrackgroup {
  creator_id: number;
  slug: string;
}

export const NewtrackModal: React.FC<{
  open: boolean;
  onClose: () => void;
  trackgroup: TrackgroupDetail;
  reload: () => Promise<void>;
}> = ({ open, trackgroup, onClose, reload }) => {
  const { register, handleSubmit } = useForm();
  const [tracks] = React.useState(trackgroup.items.map((i) => i.track));

  const doAddTrack = React.useCallback(
    async (data) => {
      const track = await createTrack({
        ...data,
        creator_id: trackgroup.creator_id,
      });
      await uploadTrackFile(track.id, data);
      await addTracksToTrackGroup(trackgroup.id, {
        tracks: [
          {
            track_id: track.id,
          },
        ],
      });
      await reload();
    },
    [trackgroup.id, trackgroup.creator_id, reload]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <TrackTable tracks={tracks} />
      <form onSubmit={handleSubmit(doAddTrack)}>
        <h3>New Track</h3>
        <div>
          Title: <InputEl {...register("title")} />
        </div>

        <InputEl
          type="file"
          id="audio"
          {...register("upload")}
          accept="audio/mpeg,audio/flac"
        />
        <Button type="submit">Add track</Button>
      </form>
    </Modal>
  );
};

export default NewtrackModal;
