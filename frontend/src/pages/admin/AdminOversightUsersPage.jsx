import { useEffect, useState } from 'react';
import * as oversightApi from '../../api/endpoint/oversightApi';

export default function AdminOversightUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    oversightApi.getAllUsers()
      .then((r) => setUsers(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setUsers([]);
        else console.error(err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Users</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Seller</th>
            <th>Buyer</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.is_seller ? '✓' : ''}</td>
              <td>{u.is_buyer ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}