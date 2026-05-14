const { randomUUID } = require("crypto");

const users = new Map();

function sanitize(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function create({ name, email, passwordHash, role }) {
  const user = {
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString()
  };

  users.set(user.email, user);
  return sanitize(user);
}

async function findByEmail(email) {
  return users.get(email.toLowerCase()) || null;
}

async function findById(id) {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }

  return null;
}

async function list() {
  return Array.from(users.values(), sanitize);
}

async function clear() {
  users.clear();
}

module.exports = {
  create,
  findByEmail,
  findById,
  list,
  clear,
  sanitize
};
