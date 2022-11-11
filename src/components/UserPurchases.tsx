import React from "react";

import { useForm } from "react-hook-form";
import Button from "./common/Button";
import { InputEl } from "./common/Input";

import { useGlobalStateContext } from "contexts/globalState";
import { fetchProducts, Product } from "services/api/User";
import { SelectEl } from "./common/Select";
import { API } from "services/Api";

import { css } from "@emotion/css";
import FormComponent from "./common/FormComponent";

const UserPurchases: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const [products, setProducts] = React.useState<Product[]>([]);
  const { register, handleSubmit } = useForm();

  const fetchProductCallback = React.useCallback(async () => {
    const fetchedProducts = await fetchProducts();
    setProducts(fetchedProducts);
  }, []);

  React.useEffect(() => {
    fetchProductCallback();
  }, [fetchProductCallback]);

  const doSave = React.useCallback(
    async (data) => {
      if (!user) {
        return;
      }
      const priceIds: string[] = [];
      if (data.credits) {
        const credit = products.find(
          (product) => product.name === data.credits
        );
        if (credit) {
          priceIds.push(credit.default_price);
        }
      }
      if (data.membership) {
        const membership = products.find(
          (product) => product.name === "Listener Subscription"
        );
        if (membership) {
          priceIds.push(membership.default_price);
        }
      }
      if (data.shares) {
        const shares = products.find(
          (product) => product.name === "Supporter Shares"
        );
        if (shares) {
          priceIds.push(shares.default_price);
        }
      }
      const params = new URLSearchParams({
        priceIds: priceIds.join(),
        shareQuantity: data.share,
        userId: `${user.id}`,
        callbackURL: window.location.href,
      });
      window.location.href = `${API}user/products/checkout?${params.toString()}`;
    },
    [products, user]
  );

  if (!products || products.length === 0) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(doSave)}
      className={css`
        margin-top: 1rem;
      `}
    >
      <h5>Purchases</h5>
      {user.isListenerMember && (
        <div
          className={css`
            font-weight: bold;
            margin-bottom: 1rem;
          `}
        >
          You are already a listener member! 🎉
        </div>
      )}
      {!user.isListenerMember && (
        <FormComponent
          className={css`
            margin-top: 0.5rem;
            display: flex;
          `}
        >
          <input id="membership" type="checkbox" {...register("membership")} />{" "}
          <label
            className={css`
              display: flex;
              flex-direction: column;
              margin-left: 0.5rem;
            `}
            htmlFor="membership"
          >
            Membership
            <small>
              10 Euros a year (listener) / Membership is free for artists (and
              label owners)
            </small>
          </label>
        </FormComponent>
      )}
      <FormComponent>
        Current credits:{" "}
        {user.credit?.total && (user.credit.total / 1000).toFixed(4)}
        <SelectEl {...register("credits")}>
          <option value="Stream-Credit-05">
            €7 (5 Credits, 16h of listening)
          </option>
          <option value="Stream-Credit-10">
            €12 (10 Credits, 32h of listening)
          </option>
          <option value="Stream-Credit-20">
            €22 (20 Credits, 64h of listening)
          </option>
          <option value="Stream-Credit-50">
            €50 (50 Credits, 128h of listening)
          </option>
        </SelectEl>
      </FormComponent>

      <FormComponent
        className={css`
          margin-top: 0.5rem;
        `}
      >
        Supporter shares
        <InputEl type="number" {...register("shares")} />
        <small>1 Euro per share</small>
      </FormComponent>
      <Button
        type="submit"
        className={css`
          margin-top: 1rem;
        `}
      >
        Purchase
      </Button>
    </form>
  );
};

export default UserPurchases;
