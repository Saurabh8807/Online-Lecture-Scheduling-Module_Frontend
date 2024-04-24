import React from "react";
import styled from "styled-components";
import Logout from "../Logout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Instructors from "./Instructors";
import CoursesAdmin from "./CoursesAdmin";
import IndividualCourse from "../IndividualCourse";

export default function Welcome({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("secret-key-admin")) {
      navigate("/admin");
    } else if (localStorage.getItem("secret-key")) {
      navigate("/instructor");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <WelcomeContainer>
      <TopBar>
        <LogoContainer>
          <Logo src="/logo.png" alt="Logo" />
          <Heading>Welcome Admin</Heading>
        </LogoContainer>
        <Logout />
      </TopBar>
      <MainContent>
        <InstructorsContainer>
          <Instructors user={user} />
        </InstructorsContainer>
        <CoursesContainer>
          <CoursesAdmin user={user} />
        </CoursesContainer>
      </MainContent>
    </WelcomeContainer>
  );
}

const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #f4f4f4; /* Light Grey */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  min-height: 100%;
  width: 100%;
`;

const InstructorsContainer = styled.div`
  width: 40%;
  background-color: #e0e0e0; /* Grey */
  color: #333333; /* Dark Grey */
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Light Shadow */
`;

const CoursesContainer = styled.div`
  width: 60%;
  background-color: #e0e0e0; /* Grey */
  color: #333333; /* Dark Grey */
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Light Shadow */
`;

const TopBar = styled.div`
  width: 100%;
  background: #f0f0f0; /* Grey */
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Light Shadow */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Heading = styled.h1`
  color: #333333; /* Dark Grey */
  font-size: 24px;
`;
