import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
function Register() {
    const [values, setvalues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            console.log(result);
        },
        variables: values,
    });
    const onSubmit = (e) => {
        e.preventDefault();
        addUser();
    };
    const onChange = (e) => {
        setvalues((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value,
        }));
    };
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    value={values.email}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    value={values.password}
                    onChange={onChange}
                />
                <Form.Input
                    label="confirm password"
                    placeholder="confirm password.."
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
        </div>
    );
}
const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Register;
