import { makeAutoObservable } from 'mobx';
import { LoginService } from "../assets/logins/login"
import { What2WatchlistLogin } from "../assets/logins/w2w"

interface LoginServices {
  [key: string]: LoginService;
}

class LoginStore {
  services: LoginServices = {
    "w2w": What2WatchlistLogin.Instance,
  };

  selectedServiceId = "w2w";

  constructor() {
    makeAutoObservable(this);
  }

  selectService = (serviceId: string) => {
    if(this.services?.[serviceId]){
      this.selectedServiceId = serviceId;
    }
  };

  selectedService = () => {
    return this.services[this.selectedServiceId];
  };

  login = (password: string, email: string | undefined,
    username: string | undefined) => {
    const service = this.selectedService();
    if (service) {
      return service.login(password, email, username);
    }
  }

  logout = () => {
    const service = this.selectedService();
    if (service) {
      return service.logout();
    }
  }
}

const logins = new LoginStore();
export default logins;
