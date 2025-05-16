export const initialState = {
  courses: [],
  loading: false,
  error: null,
};

function CourseReducer(state, action) {
  switch (action.type) {
    case "fetch_courses":
      return { ...state, courses: action.payload };
    default:
      return state;
  }
}

export default CourseReducer;
