require('dotenv').config()
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

module.exports = {
  client_id: GOOGLE_CLIENT_ID,
  client_secret: GOOGLE_CLIENT_SECRET,
  redirect_uris: [
    `https://api-blueprint-prod.herokuapp.com/user/auth_callback`,
    `http://localhost:3000/user/auth_callback`,
  ],
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
}
