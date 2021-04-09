import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
function Register(props) {
    const [errors, setErrors] = useState({});
    const [values, setvalues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
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
            <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
            >
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    type="text"
                    placeholder="Username.."
                    name="username"
                    error={errors.username?true:false}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label="Email"
                    type="email"
                    placeholder="Email.."
                    name="email"
                    error={errors.email?true:false}
                    value={values.email}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    type="password"
                    placeholder="Password.."
                    name="password"
                    error={errors.password?true:false}
                    value={values.password}
                    onChange={onChange}
                />
                <Form.Input
                    label="confirm password"
                    type="password"
                    placeholder="confirm password.."
                    name="confirmPassword"
                    error={errors.confirmPassword?true:false}
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
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
