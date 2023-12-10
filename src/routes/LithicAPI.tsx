import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonList,
  IonLabel,
  IonBadge,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { api } from "../assets/lib/axios";

function LithicAPI() {
  const apiKeyToken = "lithic-key-token";
  const [apiKey, setApiKey] = useState(localStorage.getItem(apiKeyToken) || "");
  const [transactions, setTransactions] = useState([]);
  const [alert] = useIonAlert();
  const [present, dismiss] = useIonLoading();

  const getTransactions = () => {
    const options = {
      method: "GET",
      url: "/lithic/transactions",
      params: {
        page: "1",
        page_size: "50",
      },
      headers: {
        accept: "application/json",
        Authorization: "api-key " + apiKey,
      },
    };

    return api
      .request(options)
      .then(function (response) {
        if (response?.data?.data) setTransactions(response.data.data);
        if (localStorage.getItem(apiKeyToken) !== apiKey) {
          localStorage.setItem(apiKeyToken, apiKey);
        }
      })
      .catch(function (e: Error) {
        console.error(e);
        alert({
          header: "API access failed",
          message: e.message,
          buttons: [{ text: "Ok" }],
        }).catch(console.error);
      });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    present({ message: "Loading..." })
      .then(() => getTransactions())
      .finally(() => dismiss());
  };

  useEffect(() => {
    if (apiKey.length) {
      getTransactions();
    }
  }, []);

  const ionKeyInputEl = useRef<HTMLIonInputElement>(null);
  const onKeyInput = (ev: Event) => {
    const value = (ev.target as HTMLIonInputElement).value as string;

    setApiKey(value);

    const inputCmp = ionKeyInputEl.current;
    if (inputCmp !== null) {
      inputCmp.value = value;
    }
  };

  return (
    <IonCard>
      <IonCardContent>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonInput
              label="Lithic API Key"
              labelPlacement="floating"
              placeholder="key"
              type="password"
              value={apiKey}
              onIonInput={(event) => setApiKey(event.target.value)}
            ></IonInput>
          </IonItem>

          <div className="ion-margin-top">
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              disabled={
                !apiKey.length || localStorage.getItem(apiKeyToken) === apiKey
              }
            >
              apply
            </IonButton>
          </div>
        </form>

        <IonList>
          {/* TODO: IonInfiniteScroll */}
          {transactions.map((transaction) => {
            return (
              <IonItem key={transaction.token} detail="true">
                <IonLabel>
                  {transaction.merchant}
                  <br />
                  Date: {transaction.created}
                  <br />
                  Status: {transaction.status}
                </IonLabel>
                <IonBadge slot="end" color="secondary">
                  <span style={{ fontSize: "1.5em" }}>
                    ${(transaction.amount / 100).toFixed(2)}
                  </span>
                </IonBadge>
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}

export default LithicAPI;
