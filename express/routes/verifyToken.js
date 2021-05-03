const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const jwt_auth = (req,res,next)=> {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('access denied.');
    try {
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.user = verified;
        console.log("request Authenticated..");
        next();
    }catch(error) {
        res.status(400).send("Invalid Token");
    }
};

const  google_auth =  async (token)=> {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
// verify().catch(console.error);

module.exports.jwt_auth = jwt_auth;
module.exports.google_auth = google_auth;