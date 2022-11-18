import React from "react";

import { useForm } from "react-hook-form";
import Button from "./common/Button";
import { InputEl } from "./common/Input";
import { SelectEl } from "./common/Select";

import Modal from "./common/Modal";
import { useGlobalStateContext } from "contexts/globalState";
import { css } from "@emotion/css";
import UserPurchases from "./UserPurchases";
import FormComponent from "./common/FormComponent";
import { updateUserProfile } from "services/api/User";
import { useSnackbar } from "contexts/SnackbarContext";

const ManageAccount: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const snackbar = useSnackbar();
  const { register, handleSubmit, reset } = useForm();
  const [countries, setCountries] = React.useState<
    { name: string; code: string }[]
  >([]);
  const fetchCountries = React.useCallback(async () => {
    const fetchedCountries = await fetch("/countries.json").then((res) =>
      res.json()
    );
    setCountries(fetchedCountries);
    reset({
      displayName: user?.displayName,
      country: user?.country,
      // email: user?.email,
      newsletterNotification: user?.newsletterNotification ?? false,
    });
  }, [reset, user]);

  React.useEffect(() => {
    if (user) {
      fetchCountries();
    }
  }, [user, fetchCountries]);

  const doSave = React.useCallback(
    async (data) => {
      try {
        await updateUserProfile(data);
        snackbar("Updated profile", { type: "success" });
      } catch (e) {
        snackbar("Failed to update profile", { type: "warning" });
      }
    },
    [snackbar]
  );

  return (
    <>
      <Modal open={open} onClose={onClose} size="small">
        <form onSubmit={handleSubmit(doSave)}>
          <h4>Update your account</h4>
          <FormComponent>
            Display name: <InputEl {...register("displayName")} />
          </FormComponent>
          <FormComponent>
            Country:{" "}
            <SelectEl {...register("country")}>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </SelectEl>
          </FormComponent>
          {/* TODO: This will require resending email confirmation */}
          {/* <FormComponent>
            Email: <InputEl type="email" {...register("email")} />
          </FormComponent> */}
          <FormComponent
            className={css`
              display: flex;
              margin-bottom: 0.5rem;
            `}
          >
            <input type="checkbox" {...register("newsletterNotification")} />
            <label
              className={css`
                margin-left: 0.5rem;
              `}
            >
              Subscribe to our newsletter?
            </label>
          </FormComponent>
          <Button type="submit">Save account details</Button>
        </form>
        <UserPurchases />
      </Modal>
    </>
  );
};

export default ManageAccount;
