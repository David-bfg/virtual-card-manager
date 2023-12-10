import { makeAutoObservable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import meteorServerSock from "../assets/lib/meteor-sock";
import LoginStore from "./LoginStore";

export interface sub {
  logo: string;
  service_name: string;
  plan?: string;
  price: number;
  period: string;
  service_id: string;
  id?: string;
  cardToken?: string;
}

class SubscriptionsStore {
  loginServiceIds: string[] = Object.keys(LoginStore.accounts);
  // TODO: figure out if I want to implement this
  // loadedSubscriptions = new Map<string, boolean>(
  //   this.loginServiceIds.map((x) => [x, false])
  // );
  userSubscriptions: { [key: string]: { active: boolean; sub: sub }[] } =
    Object.fromEntries(
      new Map<string, { active: boolean; sub: sub }[]>(
        this.loginServiceIds.map((x) => [x, []])
      )
    );
  subIdMap: { [key: string]: sub } = {};
  cardToSub = new Map<string, sub>();

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "SubscriptionsStore",
      properties: ["userSubscriptions"],
      storage: window.localStorage,
    })
      .then(() => {
        this.loginServiceIds.forEach((id) => {
          if (!this.userSubscriptions[id]) {
            this.userSubscriptions[id] = [];
          }
        });
        Object.values(this.userSubscriptions).forEach((subList) => {
          subList.forEach((elem) => {
            if (!elem.sub.id) {
              elem.sub.id = LoginStore.selectedAccountId + elem.sub.service_id;
            }
            this.subIdMap[elem.sub.id] = elem.sub;
            if (elem.sub.cardToken) {
              this.cardToSub.set(elem.sub.cardToken, elem.sub);
            }
          });
        });
      })
      .catch(console.error);
  }

  async refresh(accountId: string) {
    if (LoginStore.accounts[accountId].loggedIn) {
      // TODO get subscription details data from function call in accounts interface.
      const activeSubscriptions = (await meteorServerSock.call(
        "subscription.details"
      )) as sub[];
      runInAction(() => {
        this.userSubscriptions[accountId].forEach((subElem) => {
          subElem.active = false;
        });
        activeSubscriptions.forEach((sub) => {
          const id = accountId + ":" + sub.service_id;
          sub.id = id;
          const value = this.subIdMap[id];
          if (value) {
            Object.assign(value, sub);
            const changeSubElem = this.userSubscriptions[accountId].find(
              (subElem) => subElem.sub.service_id === sub.service_id
            );
            if (changeSubElem) {
              changeSubElem.active = true;
            }
          } else {
            this.subIdMap[id] = sub;
            this.userSubscriptions[accountId].push({ active: true, sub });
          }
        });
      });
    }
  }

  get accountActiveSubscriptions(): sub[] {
    const accountId = LoginStore.selectedAccountId;
    return this.userSubscriptions[accountId]
      .filter((subscription) => subscription.active)
      .map((x) => x.sub);
  }

  getSubFromCard(token: string) {
    return this.cardToSub.get(token);
  }

  setSubLink(
    service_id: string,
    cardToken: string,
    accountId: string | undefined
  ) {
    const id = (accountId || LoginStore.selectedAccountId) + ":" + service_id;
    const sub = this.subIdMap[id];
    if (sub) {
      const subKey = this.cardToSub.get(cardToken)?.id;
      if (subKey && this.subIdMap[subKey]) {
        delete this.subIdMap[subKey].cardToken;
      }
      sub.cardToken = cardToken;
      this.cardToSub.set(cardToken, sub);
    } else {
      throw new Error("Error: Subscription service not found");
    }
  }

  getLinkedCardToken(service_id: string, accountId: string | undefined) {
    const id = (accountId || LoginStore.selectedAccountId) + ":" + service_id;
    return this.subIdMap[id]?.cardToken;
  }
}

const subscriptionsStore = new SubscriptionsStore();
export default subscriptionsStore;
