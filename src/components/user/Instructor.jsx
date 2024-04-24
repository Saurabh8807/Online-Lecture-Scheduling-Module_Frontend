import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout";
import { getUserSchedule } from "../../utils/APIRoutes";
import axios from "axios";
import { Spin, Card } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Meta } = Card;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Instructor = () => {
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(undefined);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminKey = localStorage.getItem("secret-key-admin");
  const userKey = localStorage.getItem("secret-key");

  useEffect(() => {
    if (adminKey) {
      navigate("/admin");
    } else if (userKey) {
      setCurrUser(JSON.parse(userKey).username);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(getUserSchedule, {
          params: { currUser },
        });
        setSchedules(response.data.schedules);
      } catch (error) {
        console.error("Error fetching Schedule:", error);
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [currUser, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin indicator={antIcon} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-900 text-white py-6 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome {currUser}</h1>
        <Logout />
      </header>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">Your Upcoming Lectures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedules.map((schedule, index) => (
            <Card key={index} className="bg-white rounded-lg shadow-md p-6">
              <Meta
                title={
                  <h3 className="text-xl font-semibold mb-2">
                    {schedule.course}
                  </h3>
                }
                description={
                  <div className="text-lg">
                    <p>
                      <strong>Lecture:</strong> {schedule.lecture}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(schedule.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Platform:</strong> {schedule.location}
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instructor;
