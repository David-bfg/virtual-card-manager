export interface Account {
  service: string;
  loggedIn: boolean;
  // TODO: implement subscription retieval
  // getUserSubscriptions(): sub;
  login(password: string, email: string | undefined,
    username: string | undefined): void | Promise;
  logout(): void | Promise<void>;
}
