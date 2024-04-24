import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    }
  }, []);

  return (
    <MainContainer>
      <Overlay>
        <Message>Welcome to Course Schedule</Message>
        <ButtonContainer>
          <Button onClick={handleLoginClick}>Login</Button>
          <Button onClick={handleRegisterClick}>Register</Button>
        </ButtonContainer>
      </Overlay>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f3f8; /* Light blue-gray background */
`;

const Overlay = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Message = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #6a67ce; /* Elegant purple */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #534f9a; /* Darker shade on hover */
  }
`;

export default Main;
