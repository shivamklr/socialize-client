import React from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import App from "./App";
const httpLink = createHttpLink({
    uri:
        process.env.NODE_ENV === "production"
            ? "https://aqueous-ravine-64756.herokuapp.com/"
            : "http://localhost:5000",
});
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("jsonwebtoken");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ``,
        },
    };
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});
export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
