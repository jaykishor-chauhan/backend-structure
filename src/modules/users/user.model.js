// 1. user.model.js: Defines the user data structure/schema
// (In a real Mongoose project, you would use: new mongoose.Schema({ ... }))

export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' }
};

// Simple sample database storage for demonstration
export const sampleUsersDB = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user' }
];

export default {
  UserSchema,
  sampleUsersDB
};
