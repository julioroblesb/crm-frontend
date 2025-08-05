// This service simulates a backend authentication service.

const users = [
  {
    id: 1,
    email: 'admin',
    password: 'contra123', // In a real app, this would be a hash.
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'vendedor1@crm.com',
    password: 'password123',
    name: 'Juan Vendedor',
    role: 'vendedor',
  },
  {
    id: 3,
    email: 'vendedor2@crm.com',
    password: 'password123',
    name: 'Ana Vendedora',
    role: 'vendedor',
  },
];

export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // In a real app, the backend would return a token and user data.
          // We are returning a subset of the user data.
          const { password, ...userWithoutPassword } = user;
          resolve({
            success: true,
            user: userWithoutPassword,
          });
        } else {
          reject({
            success: false,
            message: 'Invalid email or password.',
          });
        }
      }, 1000); // Simulate network delay
    });
  },

  getUsers: async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const usersWithoutPasswords = users.map(u => {
                const { password, ...rest } = u;
                return rest;
            });
            resolve(usersWithoutPasswords);
        }, 500);
    });
  },

  createUser: async (userData) => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const newUser = {
                  id: Math.max(...users.map(u => u.id)) + 1,
                  ...userData,
                  role: 'vendedor' // New users are always 'vendedor'
              }
              users.push(newUser);
              const { password, ...userWithoutPassword } = newUser;
              resolve(userWithoutPassword);
          }, 500);
      });
  },

  deleteUser: async (userId) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const userIndex = users.findIndex(u => u.id === userId);
              if (userIndex > -1) {
                  users.splice(userIndex, 1);
                  resolve({ success: true });
              } else {
                  reject({ success: false, message: 'User not found' });
              }
          }, 500);
      })
  }
};
