import NextAuth from "next-auth"

import type { NextAuthConfig } from "next-auth"
import Okta from "next-auth/providers/okta"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Okta({
      clientId: "myClientIdhere",
      clientSecret: "mySecretHere",
      issuer: "https://path.to.your.okta.instance.com/oauth2/default",
      // Put in a an empty `state` because Next Auth doesn't appear to be specifying this
      // properly, and Okta doesn't like a missing state param
      authorization: "https://path.to.your.okta.instance.com/oauth2/default/v1/authorize?response_type=code&state=e30="
    })
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    session({ session, token }) {
      if (token.access_token) {
        session.access_token = token.access_token
      }
      return session
    },
    jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.access_token // Store the provider's access token in the token so that we can put it in the session in the session callback above
      }

      return token
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)