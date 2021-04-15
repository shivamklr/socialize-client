import { createContext, useReducer } from "react";
import jwt_decode from "jwt-decode";

const initialState = {
    user: null,
};

if (localStorage.getItem("jsonwebtoken")) {
    const decode = jwt_decode(localStorage.getItem("jsonwebtoken"));
    if (decode.exp * 1000 < Date.now()) {
        localStorage.removeItem("jsonwebtoken");
    } else {
        initialState.user = decode;
    }
}
const AuthContext = createContext({
    user: null,
    login: (userdata) => {},
    logout: () => {},
});
function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem("jsonwebtoken", userData.token);
        dispatch({
            type: "LOGIN",
            payload: userData,
        });
    }

    function logout() {
        localStorage.removeItem("jsonwebtoken");
        dispatch({ type: "LOGOUT" });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    );
}
export { AuthContext, AuthProvider };
