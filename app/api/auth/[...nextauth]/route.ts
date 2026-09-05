import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitchProvider from "next-auth/providers/twitch";
import AppleProvider from "next-auth/providers/apple";
import TwitterProvider from "next-auth/providers/twitter";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import LinkedAccount from "@/models/LinkedAccount";
import { v4 as uuidv4 } from "uuid";

// Note: Steam uses OpenID 2.0, which requires custom routing/provider in modern NextAuth.
// We will configure a placeholder custom provider here that you can attach an OpenID relay to, 
// or use a community Steam provider once you have the STEAM_SECRET.
const SteamProvider = {
  id: "steam",
  name: "Steam",
  type: "oauth",
  authorization: {
    url: "https://steamcommunity.com/openid/login",
    params: {
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`,
      "openid.realm": `${process.env.NEXTAUTH_URL}`,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    },
  },
  token: {
    request: async (context: any) => {
      // 1. Receive complete openid.* response
      const steamParams = new URLSearchParams();
      for (const [key, value] of Object.entries(context.params)) {
        steamParams.append(key, value as string);
      }
      
      // 2 & 4. Validate the endpoint and send params back with check_authentication
      steamParams.set("openid.mode", "check_authentication");
      const verifyResponse = await fetch("https://steamcommunity.com/openid/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: steamParams.toString(),
      });
      
      const verifyText = await verifyResponse.text();
      
      // 5. Require Steam to return is_valid:true
      if (!verifyText.includes("is_valid:true")) {
        throw new Error("Steam OpenID signature validation failed");
      }
      
      // 3. Validate return_to against our expected callback using strict URL parsing
      const returnTo = context.params["openid.return_to"];
      const expectedCallback = `${process.env.NEXTAUTH_URL}/api/auth/callback/steam`;
      try {
        const returnToUrl = new URL(returnTo);
        const expectedUrl = new URL(expectedCallback);
        if (returnToUrl.origin !== expectedUrl.origin || returnToUrl.pathname !== expectedUrl.pathname) {
          throw new Error("Invalid return_to domain or pathname");
        }
      } catch (e) {
        throw new Error("Steam OpenID return_to strict validation failed");
      }
      
      // 6 & 7. Extract and validate SteamID64 namespace
      const claimedId = context.params["openid.claimed_id"];
      if (!claimedId || typeof claimedId !== "string") {
        throw new Error("Missing Steam OpenID claimed_id");
      }
      
      const steamIdMatch = claimedId.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/);
      if (!steamIdMatch) {
        throw new Error("Invalid Steam claimed_id namespace");
      }
      
      const steamId64 = steamIdMatch[1];
      
      // Provide a synthetic OAuth token payload to satisfy Auth.js
      return { tokens: { access_token: "steam_openid_validated", steamId: steamId64 } };
    }
  },
  userinfo: {
    request: async (context: any) => {
      const steamId = context.tokens.steamId;
      if (!steamId) throw new Error("Missing verified SteamID64");
      
      const steamSecret = process.env.STEAM_SECRET;
      if (!steamSecret) {
        throw new Error("STEAM_SECRET is missing from environment variables");
      }
      
      // Fetch metadata using the authoritative, verified SteamID64 (Server-side only)
      const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamSecret}&steamids=${steamId}`);
      if (!res.ok) throw new Error("Failed to fetch Steam profile metadata");
      
      const data = await res.json();
      const profile = data.response?.players?.[0];
      if (!profile) throw new Error("Steam profile not found");
      
      return profile;
    }
  },
  profile(profile: any) {
    // 9. Treat persona name as metadata, steamid as the authoritative identity
    return {
      id: profile.steamid,
      name: profile.personaname,
      email: null, // OpenID does not provide email
      image: profile.avatarfull,
    };
  },
  checks: ["none"], // Important: Disable OAuth PKCE/state checks for OpenID 2.0
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID || "",
      clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "", // Must be a generated JWT signed by Apple Private Key
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0", // Use OAuth 2.0 for X
    }),
    SteamProvider as any, // Cast to any to bypass strict Provider type for this custom OpenID setup
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      await dbConnect();

      // 1. Check if this exact provider account is already linked
      const existingLink = await LinkedAccount.findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (existingLink) {
        // Safe: they've logged in with this social account before
        const existingUser = await User.findById(existingLink.userId);
        if (!existingUser) return false;
        
        // Pass userId forward to generate vader_token later
        user.id = existingUser._id.toString();
        return true;
      }

      // 2. New social account. Check if email exists in DB.
      if (user.email) {
        const emailMatch = await User.findOne({ email: user.email });
        if (emailMatch) {
          // Found existing account.
          // SECURITY: Use provider guarantees or explicit profile claims to verify email.
          const profileEmailVerified = (profile as any)?.email_verified === true;
          const isProviderVerified = account.provider === "google" || account.provider === "apple" || profileEmailVerified;
          
          if (isProviderVerified || emailMatch.isEmailVerified) {
            await LinkedAccount.create({
              userId: emailMatch._id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            });
            user.id = emailMatch._id.toString();
            return true;
          } else {
            // Cannot safely auto-link an unverified email. Reject to prevent hijacking.
            return "/login?error=EmailAlreadyInUse";
          }
        }
      }

      // 3. Completely new user. Create Vader-Verse User and link account.
      let baseUsername = user.name ? user.name.replace(/\s+/g, "").toLowerCase() : `player_${uuidv4().substring(0, 8)}`;
      let uniqueUsername = baseUsername;
      let counter = 1;
      
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      let newUser;
      try {
        newUser = await User.create({
          username: uniqueUsername,
          email: user.email || `${uuidv4()}@${account.provider}.local`, // Safe fallback for providers w/o email (like Steam)
          isEmailVerified: account.provider === "google" || account.provider === "apple" || (profile as any)?.email_verified === true,
          onboardingCompleted: false,
          role: "user",
        });
      } catch (err: any) {
        if (err.code === 11000) {
          // Race condition during user creation (e.g. concurrent callbacks)
          return "/login?error=AccountCreationCollision";
        }
        throw err;
      }

      try {
        await LinkedAccount.create({
          userId: newUser._id,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
      } catch (err: any) {
        if (err.code === 11000) {
          // Race condition during linking: The account was linked by a concurrent request.
          // That's fine, we can still proceed since the user exists.
        } else {
          throw err;
        }
      }

      user.id = newUser._id.toString();
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && user.id) {
        // Store the resolved Vader-Verse User ID
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        // Instead of embedding the full vader_token here, we just pass the verified userId.
        // The client will hit /api/auth/exchange immediately after to trade this NextAuth session
        // for a real vader_token, ensuring Auth.js doesn't permanently own the vader_token.
        (session as any).userId = token.userId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 minutes max life - this is only a temporary bridge session!
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
