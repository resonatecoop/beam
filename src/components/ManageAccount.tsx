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
import styled from "@emotion/styled";

const Alert = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.warning};
  color: white;
  text-align: center;
  font-size: 1rem;
  padding: 1rem;
  position: relative;
  margin-bottom: 1rem;
`;

const ManageAccount: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const {
    state: { user },
    dispatch,
  } = useGlobalStateContext();
  const snackbar = useSnackbar();
  const { register, handleSubmit, reset, formState } = useForm();
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
      email: user?.email,
      password: "",
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
        const newProfile = await updateUserProfile(data);
        dispatch({ type: "setLoggedInUser", user: newProfile });
        snackbar("Updated profile", { type: "success" });
      } catch (e) {
        snackbar("Failed to update profile", { type: "warning" });
      }
    },
    [snackbar, dispatch]
  );

  return (
    <>
      <Modal open={open} onClose={onClose} size="small">
        {!user?.emailConfirmed && (
          <Alert>
            Your email address hasn't been confirmed yet. Please check your
            inbox
          </Alert>
        )}
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
          <FormComponent>
            Email: <InputEl type="email" {...register("email")} />
          </FormComponent>
          {formState?.dirtyFields?.email && (
            <FormComponent>
              Password: <InputEl type="password" {...register("password")} />
              <small>Changing your email will require your password</small>
            </FormComponent>
          )}
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
        {user?.emailConfirmed && <UserPurchases />}
      </Modal>
    </>
  );
};

export default ManageAccount;
