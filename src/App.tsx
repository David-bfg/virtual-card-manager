import "./App.css";
import Login from "./routes/Login";
import LithicAPI from "./routes/LithicAPI";
import VirtualCards from "./routes/VirtualCards";
import Subscriptions from "./routes/Subscriptions";
import CardEditor from "./routes/CardEditor";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonButtons,
  IonButton,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonSelectOption,
  IonItem,
  IonSelect,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { Route, Redirect } from "react-router";

import {
  cardOutline,
  logInOutline,
  walletOutline,
  codeSlashOutline,
  settings,
  logIn,
  logOut,
  informationCircle,
} from "ionicons/icons";
import { observer } from "mobx-react";
import loginStore from "./store/LoginStore";

setupIonicReact();

const App = observer(() => {
  const logout = () => {
    const p = loginStore.logout();
    if (p instanceof Promise) {
      p.catch(() => {
        //no-op lint suppress
      });
    }
  };
  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton>
                <IonIcon
                  slot="end"
                  icon={informationCircle}
                  size="large"
                ></IonIcon>
              </IonButton>
            </IonButtons>
            {Object.keys(loginStore.accounts).length === 1 ? (
              <IonTitle>{loginStore.selectedAccount.service}</IonTitle>
            ) : (
              <IonItem>
                <IonSelect
                  label="Chose Servcie"
                  labelPlacement="floating"
                  interface="popover"
                  value="w2w"
                >
                  {Object.keys(loginStore.accounts).map((key) => {
                    return (
                      <IonSelectOption key={key} value={key}>
                        {loginStore.accounts[key].service}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonItem>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <Login />
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              {Object.keys(loginStore.accounts).length === 1 &&
              loginStore.selectedAccount.loggedIn ? (
                <IonButton onClick={logout}>
                  <IonIcon slot="start" icon={logOut} size="large"></IonIcon>
                  Logout
                </IonButton>
              ) : (
                <IonMenuToggle>
                  <IonButton>
                    <IonIcon slot="start" icon={logIn} size="large"></IonIcon>
                    Login
                  </IonButton>
                </IonMenuToggle>
              )}
            </IonButtons>
            <IonTitle>
              Sub-Troll <br /> Gain controll of your subscriptions
            </IonTitle>
            <IonButtons slot="end">
              <IonButton>
                <IonIcon slot="end" icon={settings} size="large"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect exact path="/" to="/login" />
                {/*
                  Use the render method to reduce the number of renders your component will have due to a route change.

                  Use the component prop when your component depends on the RouterComponentProps passed in automatically.
                */}
                <Route path="/login" render={() => <Login />} exact={true} />
                <Route
                  path="/subscriptions"
                  render={() => <Subscriptions />}
                  exact={true}
                />
                <Route
                  path="/subscriptions/card-edit/:id"
                  render={() => <CardEditor />}
                />
                <Route
                  path="/subscriptions/card-add/:id"
                  render={() => <CardEditor />}
                />
                <Route
                  path="/cards"
                  render={() => <VirtualCards />}
                  exact={true}
                />
                <Route path="/cards/edit/:id" render={() => <CardEditor />} />
                <Route
                  path="/lithic"
                  render={() => <LithicAPI />}
                  exact={true}
                />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="login" href="/login">
                  <IonIcon icon={logInOutline} />
                  <IonLabel>Login</IonLabel>
                </IonTabButton>
                <IonTabButton tab="subscriptions" href="/subscriptions">
                  <IonIcon icon={walletOutline} />
                  <IonLabel>Subscriptions</IonLabel>
                </IonTabButton>
                <IonTabButton tab="virtual-cards" href="/cards">
                  <IonIcon icon={cardOutline} />
                  <IonLabel>Virtual Cards</IonLabel>
                </IonTabButton>
                <IonTabButton tab="lithic-api" href="/lithic">
                  <IonIcon icon={codeSlashOutline} />
                  <IonLabel>Lithic API</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonContent>
      </IonPage>
    </>
  );
});

export default App;
