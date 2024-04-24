import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { allInstructors } from "../../utils/APIRoutes";

export default function Instructors({ user }) {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        if (user) {
          const response = await axios.get(`${allInstructors}/${user._id}`);
          // Filter out instructors whose isAdmin property is true
          const filteredInstructors = response.data.filter(
            (instructor) => !instructor.isAdmin
          );
          setInstructors(filteredInstructors);
          console.log(instructors)
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, [user]);

  return (
    <div className="flex flex-col items-center overflow-y-auto max-h-96">
      <h1 className="text-gray-900 text-3xl bg-blue-500 p-4 rounded-lg mb-6 w-11/12 text-center shadow-lg">
        Instructors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-11/12">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
          >
            <Link
              to={{
                pathname: `/individualinstructor/${instructor.username}`,
                state: { instructorUsername: instructor.username },
              }}
              className="block"
            >
              <img
                src={`https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=`}
                alt={instructor.username}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {instructor.username}
                </h3>
                <p className="text-sm text-gray-600">{instructor.bio}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
