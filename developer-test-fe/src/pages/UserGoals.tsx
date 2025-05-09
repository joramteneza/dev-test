import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery, gql } from "@apollo/client";
import { ChevronLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";

const GET_USER_GOALS = gql`
  query goals($userId: String!) {
    goals(userId: $userId) {
      id
      name
      description
      date
      color
    }
  }
`;

// interface Goal {
//     id: string;
//     name: string;
//     description: string;
//     date: string;
//     color: string;
// }

const UserGoals: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Explicitly type the params here

  if (!userId) {
    return <div>Error: No user ID found</div>; // Handle case where userId is not found
  }

  const { loading, error, data } = useQuery(GET_USER_GOALS, {
    variables: { userId }, // Pass the userId to the query
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 w-fit">
        <Link to="/" key="home" className=" w-fit">
          <Button
            variant="ghost"
            className="flex items-center pl-0 cursor-pointer hover:bg-light-gray-200"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>
      <div className="p-6 rounded-lg">
        <Timeline goals={data.goals} />
      </div>
    </div>
  );
};

export default UserGoals;
