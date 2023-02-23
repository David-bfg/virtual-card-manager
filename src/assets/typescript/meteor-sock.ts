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

export default meteorServerSock;
