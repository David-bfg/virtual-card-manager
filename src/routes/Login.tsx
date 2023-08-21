import React, { useState, useEffect, useRef } from "react";
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
import { useHistory } from "react-router-dom";
import { logIn, logOut } from "ionicons/icons";
import meteorServerSock from "../assets/lib/meteor-sock";

const Login = () => {
  const what2watchlistToken = "w2w-token";
  let loginEvent: Event,
    logoutEvent: Event,
    loginSessionLostEvent: Event,
    loginResumeEvent: Event;
  const history = useHistory();
  const [alert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [loggedIn, setLoggedIn] = useState(
    !!(meteorServerSock.token && meteorServerSock.userId)
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loginEvent = meteorServerSock.on("login", () => {
      setLoggedIn(true);
      console.log("User logged in");
    });

    logoutEvent = meteorServerSock.on("logout", () => {
      setLoggedIn(false);
      console.log("User logged out");
    });

    loginSessionLostEvent = meteorServerSock.on("loginSessionLost", () => {
      setLoggedIn(false);
      console.log(
        "User lost connection to server, will auto resume " +
          "by default with token"
      );
    });

    loginResumeEvent = meteorServerSock.on("loginResume", () => {
      setLoggedIn(true);
      console.log("User resumed (logged in by token)");
    });

    return () => {
      loginEvent.stop();
      logoutEvent.stop();
      loginSessionLostEvent.stop();
      loginResumeEvent.stop();
    };
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loggedIn) {
      present({ message: "Loading..." })
        .then(() => meteorServerSock.logout())
        .then(() => {
          localStorage.removeItem(what2watchlistToken);
        })
        .finally(() => dismiss());
    } else {
      present({ message: "Loading..." })
        .then(() =>
          meteorServerSock.login({
            password: password,
            user: {
              username: username,
            },
          })
        )
        .then(
          (userAuth: {
            id: string;
            token: string;
            tokenExpires: Date;
            type: string;
          }) => {
            if (userAuth) {
              localStorage.setItem(what2watchlistToken, userAuth.token);
            }
          }
        )
        .catch((e: Error) => {
          console.error("Login failed.", e.message);
          alert({
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
              disabled={loggedIn}
              style={loggedIn ? { opacity: 0.1 } : undefined}
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
              disabled={loggedIn}
              style={loggedIn ? { opacity: 0.1 } : undefined}
            ></IonInput>
          </IonItem>

          <div className="ion-margin-top">
            <IonButton
              expand="full"
              type="submit"
              color="secondary"
              disabled={!(loggedIn || (password.length && username.length))}
            >
              <IonIcon icon={loggedIn ? logOut : logIn} slot="start" />
              {loggedIn ? "Logout" : "Login"}
            </IonButton>
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default Login;
