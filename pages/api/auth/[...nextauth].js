import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken } from "spotify-web-api-node/src/server-methods";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

// async function refreshAccessToken(token) {
//   try {
//     spotifyApi.setAccessToken(token.accessToken);
//     spotifyApi.setRefreshToken(token.refreshToken);
//     //Destructure the response
//     const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
//     console.log("REFRESHED TOKEN IS: ", refreshedToken);

//     return {
//         ...token,
//         accessToken: refreshedToken.access_token,
//         // = 1 hour as 3600 returns from the spotify api 
//         accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
//         // Replace the access token if new one came back else fall back to old refresh token
//         refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
//     }
//   } catch (error) {
//     console.error(error);
//     return {
//       ...token,
//       error: "RefreshTokenError",
//     };
//   }
// }

export default NextAuth({
  // Configure one or more authentication providers
  //Environment variables are used to keep track of the secret items of the application
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //If initial sign in then return the original token
      //Reference token rotation article from next auth in documentation
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          //Here we are handling expiry times in milliseconds hence * 1000
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      //Return the previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      //If the access token has expired after one hour, we need to refresh the token
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING");
      return await refreshAccessToken(token);
    },

    async session({ session, token}) { 
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session;
    }
  },
});
