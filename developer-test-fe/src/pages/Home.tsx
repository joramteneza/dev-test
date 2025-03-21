// src/pages/Home.tsx
import React from 'react';
import { UserCard } from '../components/UserCard';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '@/features/usersSlice';

const Home: React.FC = () => {
  const { data, error, isLoading } = useGetUsersQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as any).message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex flex-col h-screen items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Financial Goals Timeline</h1>
        <p className="text-gray-600">Select a user to view their financial and life goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data?.data?.users?.map((user: any) => (
          <Link key={user.id} to={`/goals/${user.id}`}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
