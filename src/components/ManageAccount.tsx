import React from "react";

import { useForm } from "react-hook-form";
import Button from "./common/Button";
import { InputEl } from "./common/Input";

import Modal from "./common/Modal";
import { useGlobalStateContext } from "contexts/globalState";
import { css } from "@emotion/css";
import UserPurchases from "./UserPurchases";

const ManageAccount: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (user) {
      reset({
        nickname: user?.nickname,
      });
    }
  }, [reset, user]);

  const doSave = React.useCallback(async (data) => {}, []);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Manage Account</Button>

      <Modal open={open} onClose={() => setOpen(false)} size="small">
        <form onSubmit={handleSubmit(doSave)}>
          <h4>Update your account</h4>
          <div>
            Display name: <InputEl {...register("nickname")} />
          </div>
          <div>
            Email: <InputEl type="email" {...register("email")} />
          </div>
          <div
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
          </div>
          <Button type="submit">Save account details</Button>
        </form>
        <UserPurchases />
      </Modal>
    </>
  );
};

export default ManageAccount;
