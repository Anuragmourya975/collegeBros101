import { createStore } from "redux";

const initialState = {
  isLoggedIn: false,
  isModalOpen: false,
  formData: {},
  token: "",
  searchQuery: "",
  upvotes: 0,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":
      return {
        ...state,
        isLoggedIn: action.value,
      };
    case "LOGIN_TOKEN":
      return {
        ...state,
        token: action.value,
      };
    case "SET_IS_MODAL_OPEN":
      return {
        ...state,
        isModalOpen: action.value,
      };
    case "SAVE_FORM_DATA":
      return {
        ...state,
        formData: action.value, // Update the formData with the saved form data
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.value,
      };
    case "UPVOTE":
      return {
        ...state,
        upvotes: action.value,
      };

    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
