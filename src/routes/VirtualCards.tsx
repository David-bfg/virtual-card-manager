import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonBadge,
} from "@ionic/react";
import { api } from "../assets/lib/axios";

interface card {
  token: string;
  last_four: string;
  memo: string;
  spend_limit: number;
  spend_limit_duration: string;
  exp_month: string;
  exp_year: string;
  state: string;
  created: string;
  funding: object;
  type: string;
  auth_rule_tokens: Array<string>;
}

function VirtualCards() {
  const apiKeyToken = "lithic-key-token";
  const [virtualCards, setVirtualCards] = useState<card[]>([]);

  function refresh() {
    const apiKey = localStorage.getItem(apiKeyToken) || "";

    if (apiKey.length) {
      const options = {
        method: "GET",
        url: "/lithic/cards",
        params: {
          account_token: "1e7a5674-410c-4dbc-bf09-5fad51087f5a",
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
          const data: card[] | undefined = response?.data?.data;
          if (Array.isArray(data)) {
            setVirtualCards(
              data.filter((card) =>
                [
                  "OPEN",
                  "PAUSED",
                  "CLOSED",
                  "PENDING_ACTIVATION",
                  "PENDING_FULFILLMENT",
                ].includes(card.state)
              )
            );
          } else {
            setVirtualCards([]);
          }
          // TODO: add case for multiple pages.
          // mapCards.clear();
          // virtualCards.forEach((card, i) => mapCards.set(card.token, i));
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      setVirtualCards([]);
      // mapCards.clear();
    }
  }

  useEffect(() => {
    if (localStorage.getItem(apiKeyToken)?.length) {
      refresh();
    }
  }, []);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Virtual Cards</IonCardTitle>
        <IonCardSubtitle>
          Cards for limiting service charges and repeated billing policies
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <IonList>
          {virtualCards.map((card) => {
            return (
              <IonItem
                key={card.token}
                detail={true}
                routerLink={"/cards/edit/" + card.token}
              >
                {/* <IonThumbnail slot="start">
                  <img alt="Service logo" src={sub.logo} />
                </IonThumbnail> */}
                <IonLabel>
                  Virtual Card: {card.memo}
                  <br />
                  Expires: {card.exp_month}/{card.exp_year}
                  <br />
                  Status:{" "}
                  {card.state.charAt(0) + card.state.substring(1).toLowerCase()}
                  <br />
                  XXXX-XXXX-XXXX-{card.last_four}
                </IonLabel>
                <IonBadge slot="end" color="secondary">
                  <span style={{ fontSize: "1.5em" }}>
                    ${(card.spend_limit / 100).toFixed(2)}
                  </span>
                </IonBadge>
              </IonItem>
            );
          })}
        </IonList>
        <IonButton fill="clear" style={{ float: "left" }}>
          Action 1
        </IonButton>
        <IonButton fill="clear" style={{ float: "left" }}>
          Action 2
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
}

export default VirtualCards;
