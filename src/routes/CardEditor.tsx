import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import { api } from "../assets/lib/axios";
import { Card } from "./card";
import subscriptionStore from "../store/SubscriptionStore";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonToggle,
  IonRange,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";

type CardEdits = {
  memo: string;
  spend_limit: number;
  spend_limit_duration: string;
  state: string;
  add_tax: boolean;
  tax: number;
};

const CardEditor = observer(() => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const router = useIonRouter();
  const [cardDefault, setCardDefault] = useState<CardEdits | null>(null); // TODO: app state replace
  const [card, setCard] = useState({
    memo: "",
    spend_limit: 0,
    spend_limit_duration: "",
    state: "OPEN",
    add_tax: false,
    tax: 7,
  });
  const apiKeyToken = "lithic-key-token";

  const resetCardDefaults = () => {
    setCard((cardState) => ({ ...cardState, ...cardDefault }));
  };

  useEffect(() => {
    if (
      id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      const apiKey = localStorage.getItem(apiKeyToken) || "";

      if (apiKey.length) {
        const options = {
          method: "GET",
          url: "/lithic/cards",
          params: {
            page: "1",
            page_size: "100",
          },
          headers: {
            accept: "application/json",
            Authorization: "api-key " + apiKey,
          },
        };

        api
          .request(options)
          .then(function (response) {
            const data: Card[] = response.data.data;
            const resCard = data.filter((card) => card.token === id)[0];
            setCardDefault(resCard);
            setCard((cardState) => ({ ...cardState, ...resCard }));
            // TODO: add case for multiple pages.
            // mapCards.clear();
            // virtualCards.forEach((card, i) => mapCards.set(card.token, i));
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    } else {
      const sub = subscriptionStore.subIdMap[id];
      if (sub) {
        const resCard = {
          memo: sub.service_name,
          spend_limit: sub.price,
          spend_limit_duration: sub.period,
          state: "OPEN",
          add_tax: false,
          tax: 7,
        };
        setCardDefault(resCard);
        setCard((cardState) => ({ ...cardState, ...resCard }));
      }
    }
  }, []);

  useEffect(() => {
    if (cardDefault && cardDefault.spend_limit) {
      if (card.add_tax) {
        setCard((cardState) => ({
          ...cardState,
          spend_limit: Math.ceil(
            (cardDefault.spend_limit * (100 + cardState.tax)) / 100
          ),
        }));
      } else {
        setCard((cardState) => ({
          ...cardState,
          spend_limit: cardDefault.spend_limit,
        }));
      }
    }
  }, [card.add_tax]);

  useEffect(() => {
    if (cardDefault && cardDefault.spend_limit) {
      if (card.add_tax) {
        setCard((cardState) => ({
          ...cardState,
          spend_limit: Math.ceil(
            (cardDefault.spend_limit * (100 + cardState.tax)) / 100
          ),
        }));
      }
    }
  }, [card.tax]);

  const applyCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("apply");
    // do stuff
    // router.goBack() when successful
  };

  const ionLimitInputEl = useRef<HTMLIonInputElement>(null);

  const onLimitInput = (ev: Event) => {
    const value = (ev.target as HTMLIonInputElement).value as string;
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    setCard((cardState) => ({ ...cardState, spend_limit: numericValue }));

    const inputCmp = ionLimitInputEl.current;
    if (inputCmp !== null) {
      inputCmp.value = dollarMask(numericValue);
    }
  };

  const dollarMask = (cents: number) => {
    if (!cents) return "";

    const value = Math.floor(cents).toString();
    const mask = ["$ "];

    if (value.length < 3) {
      mask.push("0.");
      if (value.length === 1) {
        mask.push("0");
      }
    }
    for (let index = 0; index < value.length; index++) {
      const remain = value.length - index;
      mask.push(value[index]);

      if (!(remain % 3)) {
        if (remain == 3) {
          mask.push(".");
        } else {
          mask.push(",");
        }
      }
    }
    return mask.join("");
  };

  return (
    <IonCard>
      <div>CardEditor</div>
      <IonCardContent>
        <form onSubmit={applyCard}>
          <IonItem>
            <IonInput
              label="Card Name"
              labelPlacement="floating"
              placeholder="name"
              value={card.memo}
              onIonChange={(event) =>
                setCard((cardState) => ({
                  ...cardState,
                  memo: event.target.value as string,
                }))
              }
            ></IonInput>
          </IonItem>

          <IonItem style={card.add_tax ? {} : { opacity: 0.5 }}>
            <IonRange
              labelPlacement="start"
              label="Tax"
              value={card.tax * 2}
              ticks={true}
              snaps={true}
              min={8}
              max={24}
              pin={true}
              pinFormatter={(value: number) => `${(value / 2).toFixed(1)}%`}
              onIonChange={(event) =>
                typeof event.target.value === "number" &&
                setCard((cardState) => ({
                  ...cardState,
                  tax: (event.target.value as number) / 2,
                }))
              }
            >
              <IonToggle
                slot="end"
                checked={card.add_tax}
                onClick={() =>
                  setCard((cardState) => ({
                    ...cardState,
                    add_tax: !cardState.add_tax,
                  }))
                }
              ></IonToggle>
            </IonRange>
          </IonItem>

          <IonItem>
            <IonInput
              label="Spending Limit"
              labelPlacement="floating"
              placeholder="$ 0.00"
              value={dollarMask(card.spend_limit)}
              onIonInput={onLimitInput}
              ref={ionLimitInputEl}
              maxlength={10}
              disabled={card.add_tax}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonSelect
              label="Spending Limit Period"
              labelPlacement="floating"
              interface="popover"
              value={card.spend_limit_duration}
              onIonChange={(event) =>
                setCard((cardState) => ({
                  ...cardState,
                  spend_limit_duration: event.target.value as string,
                }))
              }
            >
              <IonSelectOption value="MONTHLY">Monthly</IonSelectOption>
              <IonSelectOption value="ANNUALLY">Annually</IonSelectOption>
              <IonSelectOption value="TRANSACTION" disabled={true}>
                Each Transaction
              </IonSelectOption>
              <IonSelectOption value="FOREVER" disabled={true}>
                Card Lifetime
              </IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonSelect
              label="Card State"
              labelPlacement="floating"
              interface="popover"
              value={card.state}
              onIonChange={(event) =>
                setCard((cardState) => ({
                  ...cardState,
                  state: event.target.value as string,
                }))
              }
            >
              <IonSelectOption value="OPEN">Open</IonSelectOption>
              <IonSelectOption value="PAUSED">Paused</IonSelectOption>
              <IonSelectOption value="CLOSED" disabled={true}>
                Closed
              </IonSelectOption>
              {/* TODO: have a better way to close a card or explicitly say do it from lithic dashboard */}
            </IonSelect>
          </IonItem>

          <div className="ion-margin-top">
            <IonButton
              fill="clear"
              style={{ float: "left" }}
              onClick={() => router.goBack()}
            >
              Cancel
            </IonButton>
            <IonButton fill="clear" style={{ float: "right" }} type="submit">
              Apply
            </IonButton>
            <IonButton
              fill="clear"
              style={{ float: "right" }}
              onClick={resetCardDefaults}
            >
              Reset
            </IonButton>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
});

export default CardEditor;
