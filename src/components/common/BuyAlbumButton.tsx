import { css } from "@emotion/css";
import { useGlobalStateContext } from "contexts/globalState";
import { useSnackbar } from "contexts/SnackbarContext";
import React from "react";
import { FaCheck } from "react-icons/fa";
import {
  buyTrack,
  checkPlayCountOfTrackIds,
  fetchUserProfile,
} from "services/Api";
import { calculateRemainingCost } from "utils/tracks";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

export const BuyAlbumButton: React.FC<{
  trackgroup: Partial<Release>;
}> = ({ trackgroup }) => {
  const {
    state: { user },
    dispatch,
  } = useGlobalStateContext();
  const snackbar = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [isBuyAlbumOpen, setIsBuyAlbumOpen] = React.useState(false);
  const [albumRemainingCost, setAlbumRemainingCost] = React.useState(0);

  const fetchTracks = React.useCallback(async (checkTracks: Track[]) => {
    setIsLoading(true);
    const plays = await checkPlayCountOfTrackIds(checkTracks.map((c) => c.id));
    plays.forEach((play) => {});
    let totalRemainingCost = 0;
    checkTracks.forEach((t) => {
      const hasPlay = plays.find((p) => p.track_id === t.id);
      const remainingCost = calculateRemainingCost(hasPlay?.count ?? 0);
      totalRemainingCost += remainingCost;
    });
    setAlbumRemainingCost(totalRemainingCost);
    setIsLoading(false);
  }, []);

  const openMenu = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsBuyAlbumOpen(true);
    },
    []
  );

  const buyAlbum = React.useCallback(async () => {
    setIsPurchasing(true);
    try {
      await Promise.all(
        trackgroup.items?.map((item) => {
          return buyTrack(item.track.id);
        }) ?? []
      );
      const profile = await fetchUserProfile();
      dispatch({ type: "setUserCredits", credits: profile.credits });
      snackbar("You bought the song!", { type: "success" });
      setIsBuyAlbumOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPurchasing(false);
    }
  }, [snackbar, trackgroup.items, dispatch]);

  React.useEffect(() => {
    fetchTracks(trackgroup.items?.map((i) => i.track) ?? []);
  }, [fetchTracks, trackgroup.items, isBuyAlbumOpen]);

  if (!user || !user.id) {
    return null;
  }

  return (
    <>
      {albumRemainingCost > 0 && (
        <>
          <Button onClick={(e) => openMenu(e)} compact>
            Buy Album
          </Button>
          <Modal
            open={isBuyAlbumOpen}
            onClose={() => setIsBuyAlbumOpen(false)}
            size="small"
          >
            <h4>Are you sure you want to buy this album?</h4>
            <p
              className={css`
                margin-bottom: 1rem;
              `}
            >
              This will cost <strong>{albumRemainingCost}</strong> credits
            </p>
            <div
              className={css`
                display: flex;
              `}
            >
              <Button
                variant="outlined"
                onClick={() => setIsBuyAlbumOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={buyAlbum}
                disabled={isPurchasing}
                startIcon={isPurchasing ? <LoadingSpinner /> : undefined}
              >
                Yes, Please!
              </Button>
            </div>
          </Modal>
        </>
      )}
      {albumRemainingCost === 0 && !isLoading && (
        <>
          <FaCheck
            className={css`
              margin-right: 0.5rem;
              margin-left: 0.5rem;
            `}
          />
          You own all songs on this album!
        </>
      )}
    </>
  );
};

export default BuyAlbumButton;
