import "styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "components/layout";
import NextNProgress from "nextjs-progressbar";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const client = new ApolloClient({
  uri: "https://theredniggas.herokuapp.com/",
  cache: new InMemoryCache(),
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <NextNProgress
          color="#0569c7"
          height={2}
          options={{ showSpinner: false }}
        />
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
