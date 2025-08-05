import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();


  const fetchUsers = async () => {
    setLoading(true);
    const userList = await authService.getUsers();
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    // This would typically open a modal form
    const name = prompt("Enter new user's name:");
    const email = prompt("Enter new user's email:");
    const password = prompt("Enter new user's password:");

    if (name && email && password) {
        await authService.createUser({ name, email, password });
        fetchUsers(); // Refresh the list
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
        alert("You cannot delete yourself.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      await authService.deleteUser(userId);
      fetchUsers(); // Refresh the list
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleAddUser}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
