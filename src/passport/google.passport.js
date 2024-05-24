const { Strategy } = require("passport-google-oauth2");

const GooglePassport = new Strategy(
  {
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: process.env.SERVER_API,
    passReqToCallback: true,
    scope: ["profile"],
  },
  async (request, accessToken, refreshToken, profile, cb) => {
    const dataSave = {
      email: profile?.email,
      name: profile?.displayName,
      avatar: profile?._json?.picture,
    };

    return cb(null, dataSave);
  }
);

module.exports = GooglePassport;
