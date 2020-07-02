require('dotenv').config()
import app from './app'

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(` -> Blueprint API started at http://localhost:${port}/`)
})
