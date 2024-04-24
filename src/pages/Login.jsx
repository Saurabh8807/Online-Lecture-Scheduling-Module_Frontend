import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    }
  }, []);

  const validateForm = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      toast.error("Username and Password are required.");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (await validateForm()) {
      const { username, password } = form.getFieldsValue();
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (!data.status) {
          toast.error(data.msg);
        } else {
          const user = data.user;
          if (user.isAdmin) {
            localStorage.setItem("secret-key-admin", JSON.stringify(user));
            navigate("/admin");
          } else {
            localStorage.setItem("secret-key", JSON.stringify(user));
            navigate("/instructor");
          }
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An error occurred during login. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          {" "}
          {/* Added shadow */}
          <Title level={2} className="text-center mb-6">
            Course Schedule
          </Title>
          <Form form={form} onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
              >
                Log In
              </Button>
            </Form.Item>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create One.
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
