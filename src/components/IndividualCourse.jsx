import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Input, Select, Typography, Card } from "antd";
import { Modal } from "antd";

import Logout from "./Logout";
import {
  getSchedule,
  allInstructors,
  getCourseName,
  addSchedule,
  checkAvailable,
} from "../utils/APIRoutes";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const IndividualCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [dropDropUser, setDropUser] = useState(undefined);
  const [id, setId] = useState(null);
  const [courseName, setCourseName] = useState("Dummy Course");
  const [instructorData, setInstructorData] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [lectureData, setLectureData] = useState({
    instructor: "",
    date: null,
    subject: "",
    lecture: "",
    location: "",
  });

  const adminKey = localStorage.getItem("secret-key-admin");
  const userKey = localStorage.getItem("secret-key");

  useEffect(() => {
    if (adminKey) {
      const adminUserData = JSON.parse(adminKey);
      setId(adminUserData._id);
    } else if (userKey) {
      navigate("/instructor");
    } else {
      navigate("/");
    }
  }, [navigate, adminKey, userKey]);

  const updateInstructorData = (instructor) => {
    const existingInstructor = instructorData.find(
      (i) => i === instructor.username
    );
    if (!existingInstructor) {
      setInstructorData((prevData) => [...prevData, instructor.username]);
    }
  };

  const getCourseNameById = async (courseId) => {
    try {
      const response = await axios.get(`${getCourseName}/${courseId}`);
      return response.data.courseName;
    } catch (error) {
      console.error("Error fetching course name:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        if (courseId) {
          setCourseName(await getCourseNameById(courseId));
        }
      } catch (error) {
        console.error("Error fetching course name:", error);
      }
    };
    fetchCourseName();
  }, [courseId]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        if (id) {
          const response = await axios.get(`${allInstructors}/${id}`);
           const fetchedInstructors = response.data.filter(
             (instructor) => !instructor.isAdmin
           );
          fetchedInstructors.forEach(updateInstructorData);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, [id]);

  const handleChange = (name, value) => {
    setLectureData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInstructorSelection = (selectedInstructor) => {
    setDropUser(selectedInstructor);
    setSelectedInstructor(selectedInstructor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const course = courseName;
    const scheduleData = {
      course: course,
      lecture: lectureData.lecture,
      date: lectureData.date,
      instructor: dropDropUser,
      location: lectureData.location,
    };
    try {
      const availabilityCheckResponse = await axios.post(checkAvailable, {
        username: dropDropUser,
        date: lectureData.date,
      });

      if (availabilityCheckResponse.status === 200) {
        const response = await axios.post(addSchedule, scheduleData);
        console.log("Schedule added successfully:", response.data);
      } else {
Modal.error({
  title: "Instructor Busy",
  content: "The instructor is busy on this date.",
});      }
    } catch (error) {
      console.error("Error checking instructor availability:", error);
    }

    setLectureData({
      instructor: "",
      date: null,
      subject: "",
      lecture: "",
      location: "",
    });
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(getSchedule, {
          params: { courseName },
        });
        setSchedule(response.data.schedules);
      } catch (error) {
        console.error("Error fetching Schedule:", error);
      }
    };
    fetchSchedules();
  }, [courseName, dropDropUser, handleSubmit]);

  return (
    <div className="flex flex-col items-center h-screen bg-gray-200">
      <div className="w-full bg-navy p-4 flex justify-between items-center">
        <Logout />
        <Title level={2} className="text-white">
          {courseName}
        </Title>
        <Title level={2} className="text-white">
          Welcome admin
        </Title>
      </div>
      <div className="w-full flex justify-between p-4  overflow-y-auto ">
        {schedule.length === 0 ? (
          <Text className="text-black text-xl">No lectures scheduled.</Text>
        ) : (
          <div className="flex flex-wrap justify-center overflow-y-auto gap-4">
            {schedule.map((scheduleItem, index) => (
              <Card
                key={index}
                className="rounded-lg shadow-md"
                style={{ width: 300 }}
              >
                <div>
                  <Title level={4}>Lecture: {scheduleItem.lecture}</Title>
                  <Text strong>Instructor:</Text>{" "}
                  <Text>{scheduleItem.instructor}</Text>
                  <br />
                  <Text strong>Date:</Text>{" "}
                  <Text>
                    {new Date(scheduleItem.date).toLocaleDateString()}
                  </Text>
                  <br />
                  <Text strong>Platform:</Text>{" "}
                  <Text>{scheduleItem.location}</Text>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="w-full flex justify-center">
          {/* Center the form */}
          <div className="form-container overflow-y-auto max-h-[400px]">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-300 p-4 flex flex-col justify-between items-center border border-gray-300 rounded-lg"
              style={{ width: "100%", maxWidth: 400 }} // Adjust the width and max width as needed
            >
              <Title level={2} className="text-white mb-4">
                Schedule a Lecture
              </Title>
              <Select
                name="instructor"
                value={selectedInstructor}
                onChange={handleInstructorSelection}
                placeholder="Select Instructor"
                className="w-full mb-2"
              >
                {instructorData.map((instructor, index) => (
                  <Option key={index} value={instructor}>
                    {instructor}
                  </Option>
                ))}
              </Select>
              <DatePicker
                name="date"
                placeholder="Date"
                value={lectureData.date}
                onChange={(date) => handleChange("date", date)}
                className="w-full mb-2"
              />
              <Select
                name="subject"
                value={lectureData.subject}
                onChange={handleChange}
                required
                className="w-full mb-2"
              >
                <Option value="" disabled>
                  Select Course
                </Option>
                <Option>{courseName}</Option>
              </Select>
              <Input
                type="text"
                name="lecture"
                placeholder="Lecture"
                value={lectureData.lecture}
                onChange={(e) => handleChange("lecture", e.target.value)}
                required
                className="w-full mb-2"
              />
              <Input
                type="text"
                name="location"
                placeholder="Platform"
                value={lectureData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                className="w-full mb-2"
              />
              <Button type="primary" htmlType="submit" className="w-full mt-4">
                Schedule Lecture
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCourse;
