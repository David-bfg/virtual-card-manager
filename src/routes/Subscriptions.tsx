import { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonThumbnail,
  IonList,
  IonIcon,
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonBadge,
} from "@ionic/react";
import { observer } from "mobx-react";
import { autorun } from "mobx";
import loginStore from "../store/LoginStore";
import subscriptionStore from "../store/SubscriptionStore";
import { refresh } from "ionicons/icons";

export interface sub {
  logo: string;
  service_name: string;
  plan?: string;
  price: number;
  period: string;
  service_id: string;
  id?: string;
}

export interface subLink {
  sub: sub;
  cardToken?: string;
}

const Subscriptions = observer(() => {
  const [userSubscriptions, setUserSubscriptions] = useState<sub[]>([]);

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (loginStore.selectedAccount.loggedIn) {
          refreshSubs();
        }
      },
      // Fixes doublerun. Imagine to be related to nested
      // makeAutoObservable objects.
      { delay: 15 }
    );

    return () => disposer();
  }, []);

  const refreshSubs = () => {
    subscriptionStore
      .refresh(loginStore.selectedAccountId)
      .then(() => {
        setUserSubscriptions(subscriptionStore.accountActiveSubscriptions);
      })
      .catch(console.error);
  };

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
              <IonItem
                key={sub.service_id}
                detail={true}
                routerLink={
                  sub.id
                    ? "/subscriptions/card-add/" + sub.id
                    : "/subscriptions/card-edit/:id"
                }
              >
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
        <IonButton fill="clear" onClick={refreshSubs}>
          <IonIcon icon={refresh}></IonIcon>
          refresh
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
});

export default Subscriptions;
