// pages/api/users.ts
import { IUserData } from '@/types/@types';
import type { NextApiRequest, NextApiResponse } from 'next';


const users: IUserData[] = [
  {
    id: "m5gr84i9",
    names: "Ken Smith",
    usertype: "rider",
    email: "ken99@yahoo.com",
    stats: {
      totalRides: 45,
      avgRating: 4.8,
      lastActive: "2024-03-15"
    }
  },
  // Add more sample users...
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(users);
    
    case 'PUT':
      const { id } = req.query;
      const userData = req.body;
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      users[userIndex] = { ...users[userIndex], ...userData };
      return res.status(200).json(users[userIndex]);
    
    case 'DELETE':
      const userId = req.query.id as string;
      const deleteIndex = users.findIndex(u => u.id === userId);
      
      if (deleteIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      users.splice(deleteIndex, 1);
      return res.status(204).end();
    
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}