import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});

export default rollbar; 