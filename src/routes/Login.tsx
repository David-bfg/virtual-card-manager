import React, { useState, useRef } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { observer } from "mobx-react";
import { logIn, logOut } from "ionicons/icons";
import loginStore from "../store/LoginStore";

const Login = observer(() => {
  const [alert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginStore.selectedAccount.loggedIn) {
      present({ message: "Loading..." })
        .then(() => loginStore.logout())
        .finally(() => dismiss());
    } else {
      present({ message: "Loading..." })
        .then(() => loginStore.login(password, undefined, username))
        .catch((e: Error) => {
          console.error("Login failed.", e.message);
          void alert({
            header: "Login failed",
            message: e.reason,
            buttons: [{ text: "Ok" }],
          });
        })
        .finally(() => dismiss());
    }
  };

  const ionUserInputEl = useRef<HTMLIonInputElement>(null);

  const onUserInput = (ev: Event) => {
    const value = (ev.target as HTMLIonInputElement).value as string;
    const trimValue = value.trim();
    setUsername(trimValue);

    const inputCmp = ionUserInputEl.current;
    if (inputCmp !== null) {
      inputCmp.value = trimValue;
    }
  };

  return (
    <IonCard>
      <IonCardContent>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonInput
              label="Username"
              labelPlacement="floating"
              placeholder="user"
              value={username}
              onIonInput={onUserInput}
              ref={ionUserInputEl}
              disabled={loginStore.selectedAccount.loggedIn}
              style={
                loginStore.selectedAccount.loggedIn
                  ? { opacity: 0.1 }
                  : undefined
              }
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonInput
              label="Password"
              labelPlacement="floating"
              placeholder="pass"
              type="password"
              value={password}
              onIonInput={(event) => setPassword(event.target.value as string)}
              disabled={loginStore.selectedAccount.loggedIn}
              style={
                loginStore.selectedAccount.loggedIn
                  ? { opacity: 0.1 }
                  : undefined
              }
            ></IonInput>
          </IonItem>

          <div className="ion-margin-top">
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              disabled={
                !(
                  loginStore.selectedAccount?.loggedIn ||
                  (password.length && username.length)
                )
              }
            >
              <IonIcon
                icon={loginStore.selectedAccount.loggedIn ? logOut : logIn}
                slot="start"
              />
              {loginStore.selectedAccount.loggedIn ? "Logout" : "Login"}
            </IonButton>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
});

export default Login;
