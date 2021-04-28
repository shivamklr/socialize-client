import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function DeleteButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { postId },
        update(cache) {
            setConfirmOpen(false);
            const data = cache.readQuery({ query: FETCH_POSTS_QUERY });
            // console.log({ data });
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: data.getPosts.filter(
                        (post) => post.id !== postId
                    ),
                },
            });
            if (callback) callback();
        },
    });
    return (
        <>
            <Button
                as="div"
                color="red"
                onClick={() => setConfirmOpen(true)}
                floated="right"
            >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    );
}
const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

export default DeleteButton;
