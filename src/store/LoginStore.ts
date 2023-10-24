import { makeAutoObservable } from 'mobx';
import { Account } from "../assets/accounts/account"
import { What2WatchlistLogin } from "../assets/accounts/w2w"

interface LoginAccounts {
  [key: string]: Account;
}

class LoginStore {
  accounts: LoginAccounts = {
    "w2w": What2WatchlistLogin.Instance,
  };

  private _selectedAccountId = "w2w";

  constructor() {
    makeAutoObservable(this);
  }

  public set selectAccount(accountId: string) {
    if(this.accounts?.[accountId]){
      this._selectedAccountId = accountId;
    }
  }

  public get selectedAccount() {
    return this.accounts[this._selectedAccountId];
  }

  public get selectedAccountId() {
    return this._selectedAccountId;
  }

  login = (password: string, email: string | undefined,
    username: string | undefined) => {
    const account = this.selectedAccount;
    if (account) {
      return account.login(password, email, username);
    }
  }

  logout = () => {
    const account = this.selectedAccount;
    if (account) {
      return account.logout();
    }
  }
}

const logins = new LoginStore();
export default logins;
