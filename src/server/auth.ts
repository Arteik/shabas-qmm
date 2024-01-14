import { Role } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import { User, getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        id: any;
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }

    interface User {
        role: Role;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    useSecureCookies: false,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'email',
                    placeholder: 'email@domain.com'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials, req) {
                // Verify well formed credentials
                if ( !credentials || !credentials.password || !credentials.username ) {
                    return null;
                }

                // Find associated user in db
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.username
                    }
                });

                if ( !user ) {
                    return null;
                }

                // Compare hash with provided password
                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

                if (passwordsMatch) {
                    // Sketchy cast as per precedent
                    return user as unknown as User;
                }
                // If you return null then an error will be displayed advising the user to check their details.
                return null;
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.id = token.id
            }
            if (session.user && token) {
                session.user.id = (token as unknown as User).id;
                session.user.role = (token as unknown as User).role;
            }
            return session;
        },
    },
    secret: env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: env.JWT_SECRET,
        // encryption: true,
    },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    return session;
};

