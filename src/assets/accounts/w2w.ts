import { makeAutoObservable, runInAction } from 'mobx';
import meteorServerSock from "../lib/meteor-sock";
import { Account } from "./account"

const what2watchlistToken = "w2w-token";
type UserAuth =  {
  id: string;
  token: string;
  tokenExpires: Date;
  type: string;
}

export class What2WatchlistLogin implements Account {
  service = 'What 2 Watchlist';
  loggedIn = false;
  private static _instance: Account;

  private constructor() {
    makeAutoObservable(this);
    const token = localStorage.getItem(what2watchlistToken);
    if (token) {
      meteorServerSock.login({ resume: token })
        .catch((e: Error) => {
          console.error(
            "Stored login token failed. Unable to re-initiate login.",
            e
          );
        });
    }
  }

  public static get Instance()
  {
      return this._instance || (this._instance = new this());
  }

  login(password: string, email: string | undefined,
    username: string | undefined) {
    let p: Promise<UserAuth> = meteorServerSock.login({
      password,
      user: {
        username,
      },
    })
    return p.then(
      (userAuth) => {
        if (userAuth) {
          localStorage.setItem(what2watchlistToken, userAuth.token);
        }
      }
    );
  }

  logout() {
    return meteorServerSock.logout()
      .then(() => {
        localStorage.removeItem(what2watchlistToken);
      })
  }
}

const w2wInstance = What2WatchlistLogin.Instance;

let loginEvent: Event,
  logoutEvent: Event,
  loginSessionLostEvent: Event,
  loginResumeEvent: Event;

loginEvent = meteorServerSock.on("login", () => {
  runInAction(() => {
    w2wInstance.loggedIn = true;
    console.log("User logged in");
  });
});

logoutEvent = meteorServerSock.on("logout", () => {
  runInAction(() => {
    w2wInstance.loggedIn = false;
    console.log("User logged out");
  });
});

loginSessionLostEvent = meteorServerSock.on("loginSessionLost", () => {
  runInAction(() => {
    w2wInstance.loggedIn = false;
    console.log(
      "User lost connection to server, will auto resume by default with token"
    );
  });
});

loginResumeEvent = meteorServerSock.on("loginResume", () => {
  runInAction(() => {
    w2wInstance.loggedIn = true;
    console.log("User resumed (logged in by token)");
  });
});

// let closeLogins =  () => {
//   loginEvent.stop();
//   logoutEvent.stop();
//   loginSessionLostEvent.stop();
//   loginResumeEvent.stop();
// };