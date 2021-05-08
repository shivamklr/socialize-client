import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    return (
        <Grid columns={3} doubling stackable>
            <Grid.Row only="computer" className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row only="tablet" className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                <Grid.Column only="mobile" width={16} textAlign="center">
                    <h2>Recent Posts</h2>
                </Grid.Column>
                {loading || data === undefined ? (
                    <h1>Loading Recent posts..</h1>
                ) : (
                    <Transition.Group>
                        {data.getPosts &&
                            data.getPosts.map((post) => (
                                <Grid.Column
                                    key={post.id}
                                    style={{ marginBottom: 20 }}
                                >
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    );
}

export default Home;
