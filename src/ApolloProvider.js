import React from "react";
import App from "./App";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
const cache = new InMemoryCache();
const client = new ApolloClient({
    uri: "http://localhost:5000",
    cache: cache,
});
export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
