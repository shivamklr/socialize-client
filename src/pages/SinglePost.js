import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
export default function SinglePost(props) {
    const postId = props.match.params.postId;
    let postMarkup;
    const { user } = useContext(AuthContext);
    const {
        data: { getPost },
    } = useQuery(FETCH_POSTS_QUERY, { variables: { postId } });
    if (!getPost) {
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
        } = getPost;
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
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
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
