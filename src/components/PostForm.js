import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
function PostForm() {
    const [error, setError] = useState("");
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });
    const [createPost] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(cache, result) {
            // modifying cache to avoid page refresh
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY,
            });
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts:[result.data.createPost, ...data.getPosts]
                },
            });
            values.body = "";
        },
        onError(err) {
            console.log({err});
            setError(err.graphQLErrors[0].message);
        },
    });

    function createPostCallback() {
        setError("");
        createPost();
    }
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World"
                        name="body"
                        onChange={onChange}
                        error={error ? true : false}
                        value={values.body}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                        <li>{error}</li>
                    </ul>
                </div>
            )}
        </>
    );
}
const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;

export default PostForm;
