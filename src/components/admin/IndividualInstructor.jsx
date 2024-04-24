import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  getUserSchedule,
  allInstructorByUsername,
  host,
} from "../../utils/APIRoutes";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

const IndividualInstructor = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminKey = localStorage.getItem("secret-key-admin");

  useEffect(() => {
    if (!adminKey) {
      localStorage.clear();
      navigate("/");
    }
  }, [adminKey, navigate]);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const instructorResponse = await axios.get(
          `${host}/api/v1/auth/instructor/${username}`
        );
        const scheduleResponse = await axios.get(getUserSchedule, {
          params: { currUser: username },
        });
        setInstructor(instructorResponse.data);
        setSchedules(scheduleResponse.data.schedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [username]);

  const handleGoBack = () => {
    navigate(-1); // Go back one step in history
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-400 pb-4 flex flex-col justify-center items-center">
      <div className="bg-gray-200 rounded-lg p-8 w-11/12 max-w-xl shadow-md">
        <div className="flex items-center mb-4">
          <ArrowLeftOutlined
            onClick={handleGoBack}
            className="text-gray-700 text-3xl cursor-pointer mr-4"
          />
          <h1 className="text-gray-700 text-3xl font-bold">Welcome Admin</h1>
        </div>
        {instructor && (
          <>
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt={instructor.username}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-gray-700 text-2xl font-bold">
                  Instructor: {instructor.instructor.username}
                </h2>
                <p className="text-gray-600">{instructor.instructor.email}</p>
              </div>
            </div>
            <h2 className="text-gray-700 text-2xl mb-4">
              Upcoming Lectures For {instructor.instructor.username}
            </h2>
          </>
        )}
        <div className="flex flex-wrap justify-around overflow-y-auto max-h-96">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 mb-4 w-96 shadow-md"
            >
              <h3 className="text-gray-700 text-2xl font-bold mb-2">Course:</h3>
              <p className="text-gray-600 font-bold text-xl mb-2">
                {schedule.course}
              </p>
              <h3 className="text-gray-700 text-2xl font-bold mb-2">
                Lecture:
              </h3>
              <p className="text-gray-600 italic font-bold text-xl mb-2">
                {schedule.lecture}
              </p>
              <h3 className="text-gray-700 text-2xl font-bold mb-2">
                Course Name:
              </h3>
              <p className="text-gray-600 italic font-bold text-xl mb-2">
                {schedule.course}
              </p>
              <h3 className="text-gray-700 text-2xl font-bold mb-2">Date:</h3>
              <p className="text-gray-600 font-bold text-xl mb-2">
                {new Date(schedule.date).toLocaleDateString()}
              </p>
              <h3 className="text-gray-700 text-2xl font-bold mb-2">
                Platform:
              </h3>
              <p className="text-gray-600 text-lg">{schedule.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualInstructor;
