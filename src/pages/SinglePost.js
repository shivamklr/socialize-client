import React, { useContext, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Button,
    Card,
    Form,
    Grid,
    Icon,
    Image,
    Label,
} from "semantic-ui-react";
import moment from "moment";

import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";

export default function SinglePost(props) {
    const postId = props.match.params.postId;
    let postMarkup;

    const [comment, setComment] = useState("");
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId },
        onError() {
            console.log("Error while deleting in single post");
        },
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment("");
        },
        variables: { postId: postId, body: comment },
    });

    function deletePostCallback() {
        props.history.push("/");
    }

    if (loading || data === undefined) {
        postMarkup = <p> Loading post....</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount,
        } = data.getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton
                                    user={user}
                                    post={{ id, likeCount, likes }}
                                ></LikeButton>
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() =>
                                        console.log("Comment inside post page")
                                    }
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton
                                        postId={id}
                                        callback={deletePostCallback}
                                    />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={(e) => {
                                                    setComment(e.target.value);
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={submitComment}
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user &&
                                        user.username === comment.username && (
                                            <DeleteButton
                                                postId={id}
                                                commentId={comment.id}
                                            ></DeleteButton>
                                        )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup;
}
const SUBMIT_COMMENT_MUTATION = gql`
    mutation submitComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`;
const FETCH_POST_QUERY = gql`
    query getPostQuery($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;
