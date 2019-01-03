import Pusher from 'pusher';

const {
  PUSHER_APP_ID,
  PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER,
  PUSHER_APP_KEY
} = process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_APP_KEY,
  secret: PUSHER_APP_SECRET,
  cluster: PUSHER_APP_CLUSTER,
  useTLS: true
});

export default pusher;
