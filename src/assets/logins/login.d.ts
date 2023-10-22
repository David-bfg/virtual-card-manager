export interface LoginService {
  service: string;
  loggedIn: boolean;
  login(password: string, email: string | undefined,
    username: string | undefined): void | Promise;
  logout(): void | Promise<void>;
}
