import simpleDDP from 'simpleddp';
import { simpleDDPLogin } from 'simpleddp-plugin-login';
import ws from 'isomorphic-ws';


let opts = {
  endpoint: "ws://localhost:3000/websocket",
  SocketConstructor: ws,
  reconnectInterval: 5000
};
const meteorServerSock = new simpleDDP(opts,[simpleDDPLogin]);

meteorServerSock.on('connected', () => console.info('Successfully connected to Meteor running on %s !', 'localhost'));
meteorServerSock.on('disconnected', () => console.warn('Lost connection to Meteor!'));
meteorServerSock.on('error', (e: Error) => console.error('Encountered an error with connection to Meteor DDP!', e));



let password = "dbg1DBG!";
let username = "dbg";

// try {
//   await meteorServerSock.login({resume:token});
// } catch (e) {
//   // failed auth by token
// }

// you must pass password and at least one of username or email
let userAuth = await meteorServerSock.login({
  password,
  user: {
      username
  }
});


console.log(userAuth);
console.log(meteorServerSock.userId);
console.log(meteorServerSock.token);

await meteorServerSock.logout();


export default meteorServerSock;
