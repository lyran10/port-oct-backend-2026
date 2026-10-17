import mongoose from 'mongoose'

// Expose `id` instead of `_id` and hide `__v` in every API response.
mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id
    return ret
  },
})

export async function connectDb(uri: string) {
  await mongoose.connect(uri)
  console.log(`Connected to MongoDB (${mongoose.connection.name})`)
}

export async function disconnectDb() {
  await mongoose.disconnect()
}
