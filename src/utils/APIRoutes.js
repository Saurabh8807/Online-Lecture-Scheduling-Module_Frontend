export const host = "https://online-lecture-scheduling-module-backend.onrender.com";
// export const host = "https://online-lecture-scheduling-module.vercel.app";

// v1entication
// users
export const registerRoute = `${host}/api/v1/auth/register`;
export const loginRoute = `${host}/api/v1/auth/login`;
export const logoutRoute = `${host}/api/v1/auth/logout`;
export const allInstructors = `${host}/api/v1/auth/allinstructors`;
export const allInstructorByUsername = `${host}/api/v1/auth/instructor/:username`;




// course
export const addCourse = `${host}/api/v1/course/addcourse`;
export const getCourse = `${host}/api/v1/course/getcourse`;
export const getCourseName = `${host}/api/v1/course/getcoursename`;

//schedule
export const getUserSchedule = `${host}/api/v1/schedule/getuserschedule`;
export const checkAvailable = `${host}/api/v1/schedule/checkInstructorAvailability`;
export const getSchedule = `${host}/api/v1/schedule/getschedule`;
export const addSchedule = `${host}/api/v1/schedule/addschedule`;

