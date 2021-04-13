import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

function Login(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: "",
        password: "",
    });
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            console.log(result.data.login);
            context.login(result.data.login);
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values,
    });
    function loginUserCallback() {
        loginUser();
    }
    return (
        <div className="form-container">
            <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
            >
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    type="text"
                    placeholder="Username.."
                    name="username"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    type="password"
                    placeholder="Password.."
                    name="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.values(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Login;
