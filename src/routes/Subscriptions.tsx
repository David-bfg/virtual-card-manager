import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonThumbnail,
  IonList,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonBadge,
} from "@ionic/react";
import meteorServerSock from "../assets/lib/meteor-sock";

export interface sub {
  logo: string;
  service_name: string;
  plan?: string;
  price: number;
  period: string;
  service_id: string;
}

export interface subLink {
  sub: sub;
  cardToken?: string;
}

function Subscriptions() {
  const [userSubscriptions, setUserSubscriptions] = useState<sub[]>([]);

  useEffect(() => {
    if (meteorServerSock.userId) {
      meteorServerSock
        .call("subscription.details")
        .then((ret) => ret && setUserSubscriptions(ret))
        .catch(console.error);
      // userSubscriptions.value.forEach((sub) => {
      //   const id = "w2w:" + sub.service_id;
      //   const value = subLinksToVirtualCards.value[id];
      //   if (value) {
      //     value.sub = sub;
      //     if (value.cardToken) {
      //       cardToSub.set(value.cardToken, sub);
      //     }
      //   } else {
      //     subLinksToVirtualCards.value[id] = { sub: sub };
      //   }
      // });
    }
  }, []);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Subscriptions</IonCardTitle>
        <IonCardSubtitle>
          Your recomemded services for best value
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <IonList>
          {userSubscriptions.map((sub) => {
            return (
              <IonItem key={sub.service_id} detail="true" href="#">
                <IonThumbnail slot="start">
                  <img alt="Service logo" src={sub.logo} />
                </IonThumbnail>
                <IonLabel>
                  <IonLabel>{sub.service_name}</IonLabel>
                  <p>
                    {sub.plan} plan paid {sub.period.toLowerCase()}
                  </p>
                </IonLabel>
                <IonBadge slot="end" color="secondary">
                  <span style={{ fontSize: "1.5em" }}>
                    ${(sub.price / 100).toFixed(2)}
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

export default Subscriptions;
