let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ITSchema = new Schema({
    role_name: {type: String},
    level:{type: String}, 
    role_permissions: {type: String}, 
    created_at: {type: String}, 
    updated_at: {type: String}, 
    deleted_at: {type: String}, 
})

let Role = mongoose.model('role', ITSchema)
module.exports = Role;



