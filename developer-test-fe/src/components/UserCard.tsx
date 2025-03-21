import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserCardProps {
  user: {
    username: string;
    email: string;
    description: string;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="h-full transition-all hover:shadow-md cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-20 w-20 rounded-full overflow-hidden relative bg-gray-300">
          <img src='/placeholder.svg' alt={user.username} className="absolute top-3 h-20 w-20 rounded-full mx-auto fill" />
        </div>
        <div className='flex flex-col'>
        <CardTitle>{user.username}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{user.description}</CardDescription>
      </CardContent>
    </Card>
  );
};
