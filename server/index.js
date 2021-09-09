const express = require('express');
const app = express();
const PORT = 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server ready on http://localhost:${PORT}`);
});

function generateAccessToken(identity, room, config) {
  // use the twilio helper library to get Access Tokens
  const twilio = require('twilio');
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  let videoGrant;
  if (room) videoGrant = new VideoGrant({ room });
  else videoGrant = new VideoGrant();

  const token = new AccessToken(
    config.accountSid,
    config.keySid,
    config.secret
  );
  token.addGrant(videoGrant);
  token.identity = identity;
  return token;
}

// handle GET requests from the client to send
// the generated Twilio Access Token
app.get('/api/video-token/:identity/:room', (req, res) => {
  // read the required environment variables from .env file
  require('dotenv').config();
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    keySid: process.env.TWILIO_API_KEY,
    secret: process.env.TWILIO_API_SECRET,
  };

  const token = generateAccessToken(
    req.params.identity,
    req.params.room,
    config
  );

  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt(),
    })
  );
});
