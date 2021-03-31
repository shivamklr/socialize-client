import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";
function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    const {getPosts:posts} = data;
    return (
        <Grid columns={3} divided>
            <Grid.Row>Recent Posts</Grid.Row>
            <Grid.Row>
                {loading ? (
                    <h1>Loading...</h1>
                ) : (
                    posts &&
                    posts.map((post) => (
                        <Grid.Column key={post.id}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    );
}
const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
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

export default Home;
