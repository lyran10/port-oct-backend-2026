import { createApp } from './app.js'
import { config } from './config.js'
import { connectDb } from './db.js'

await connectDb(config.MONGODB_URI)

createApp().listen(config.PORT, () => {
  console.log(`API running on http://localhost:${config.PORT}`)
})
