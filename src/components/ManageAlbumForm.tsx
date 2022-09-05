import React from "react";
import Modal from "components/common/Modal";
import Button from "./common/Button";
import { useForm } from "react-hook-form";
import {
  addTracksToTrackGroup,
  createTrack,
  uploadTrackFile,
} from "services/api/User";
import TrackTable from "./common/TrackTable";
import { InputEl } from "./common/Input";
import { SelectEl } from "./common/Select";

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
        <div>
          Status:
          <SelectEl defaultValue="paid" {...register("status")}>
            <option value="free+paid">Free + Paid</option>
            <option value="hidden">Hidden</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="deleted">Deleted</option>
          </SelectEl>
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
