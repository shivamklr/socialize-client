import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import MyPopup from "../utils/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        variables: { postId, commentId },
        update(cache) {
            setConfirmOpen(false);
            if (!commentId) {
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
            } else {
            }
            if (callback) callback();
        },
    });
    return (
        <>
            <MyPopup content={commentId ? "Delete Comment" : "Delete Post"}>
                <Button
                    as="div"
                    color="red"
                    onClick={() => setConfirmOpen(true)}
                    floated="right"
                    compact
                    inverted
                >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
                size="mini"
            />
        </>
    );
}
const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`;
const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;
export default DeleteButton;
