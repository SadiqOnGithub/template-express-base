import { model, Schema } from 'mongoose'

const adminSchema = Schema({
  username: String,
  password: String,
})

const Admin = model('Admin', adminSchema)

export default Admin
