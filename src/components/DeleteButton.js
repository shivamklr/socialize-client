import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

function DeleteButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { postId },
        update() {
            setConfirmOpen(false);
            if (callback) callback();
            // TODO: Remove post from cache
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
