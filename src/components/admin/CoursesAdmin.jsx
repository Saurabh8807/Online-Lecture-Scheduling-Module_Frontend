import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addCourse, getCourse } from "../../utils/APIRoutes";

const { Option } = Select;

const CoursesAdmin = ({ user }) => {
  const [fileList, setFileList] = useState([]);
  const [courseData, setCourseData] = useState({
    name: "",
    level: "",
    description: "",
    image: null,
  });
  const [courses, setCourses] = useState([]);

  const handleChange = (name, value) => {
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    setCourseData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", courseData.name);
      formData.append("level", courseData.level);
      formData.append("description", courseData.description);
      if (courseData.image) {
        formData.append("image", courseData.image.originFileObj);
      }

      const response = await axios.post(addCourse, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setCourseData({
          name: "",
          level: "",
          description: "",
          image: null,
        });
        fetchCourses();
      } else {
        console.error("Error adding course:", response.data.error);
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      setCourseData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(getCourse);
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [courseData, user]);

  return (
    <div className="flex flex-col items-center justify-between overflow-y-auto max-h-screen py-4">
      <Form
        onFinish={handleSubmit}
        className="w-full max-w-md bg-white text-gray-800 rounded-lg p-6 mb-4 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Add a Course</h1>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter course name" }]}
        >
          <Input
            placeholder="Course Name"
            value={courseData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="level"
          rules={[{ required: true, message: "Please select course level" }]}
        >
          <Select
            placeholder="Select Level"
            value={courseData.level}
            onChange={(value) => handleChange("level", value)}
          >
            <Option value="Beginner">Beginner</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea
            placeholder="Description"
            value={courseData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Form.Item>
        <Form.Item name="image">
          <Upload fileList={fileList} onChange={handleFileChange}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Course
          </Button>
        </Form.Item>
      </Form>

      <div className="w-full flex flex-wrap justify-around mb-40">
        {courses.map((course) => (
          <Link
            to={`/individualcourse/${course._id}`}
            key={course._id}
            className="bg-white shadow-lg rounded-lg p-4 mb-4 w-72 hover:shadow-xl transition-transform"
          >
            <img
              src={course.image.url} // Assuming 'image' field contains the URL
              alt={course.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{course.name}</h2>
              <p className="text-sm">Level: {course.level}</p>
              <p className="text-sm">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesAdmin;
