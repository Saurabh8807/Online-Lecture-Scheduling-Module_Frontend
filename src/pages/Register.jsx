import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import { Form, Input, Button, Typography, Space, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);

  const [form] = Form.useForm();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleValidation = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      toast.error(error.errorFields[0].errors[0], toastOptions);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (await handleValidation()) {
      const { email, username, password, isAdmin, secretKey } =
        form.getFieldsValue();
      if (isAdmin && secretKey !== "12345678") {
        toast.error("Invalid secret key", toastOptions);
        return;
      }

      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        isAdmin,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      if (data.status === true) {
        navigate(isAdmin ? "/admin" : "/instructor");
        localStorage.setItem(
          isAdmin ? "secret-key-admin" : "secret-key",
          JSON.stringify(data.user)
        );
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setShowSecretKeyInput(e.target.checked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card
        className="max-w-md w-full"
        bordered={false}
        style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      >
        <div className="space-y-8 p-6 bg-white rounded-lg">
          <div>
            <Title level={2} className="text-center text-indigo-600">
              Course Schedule
            </Title>
          </div>
          <Form form={form} onFinish={handleSubmit} className="mt-8 space-y-6">
            <Space direction="vertical" size="large" className="ml-12">
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Username is required" }]}
                className="m-0"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
                className="m-0"
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email address"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  {
                    min: 8,
                    message: "Password should be at least 8 characters",
                  },
                ]}
                className="m-0"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
                className="m-0"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item name="isAdmin" valuePropName="checked">
                <Checkbox
                  className="text-indigo-600"
                  onChange={handleCheckboxChange}
                >
                  Register as Admin
                </Checkbox>
              </Form.Item>
              {showSecretKeyInput && (
                <Form.Item
                  name="secretKey"
                  rules={[
                    { required: true, message: "Secret key is required" },
                  ]}
                  className="m-0"
                >
                  <Input
                    prefix={<LockOutlined />}
                    placeholder="Secret Key"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              )}
            </Space>

            <div className="flex items-center justify-between">
              <div className="text-sm mb-10">
                <span className="font-medium text-gray-900">
                  Already have an account?
                </span>{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </Link>
              </div>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="large"
              >
                Create User
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}
