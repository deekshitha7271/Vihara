export const authConfig = {
    secret: process.env.SECRET_KEY,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.username = user.name;
                token.role = user.role;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.userId;
                session.user.role = token.role;
                session.user.username = token.username;
                session.user.email = token.email;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnHost = nextUrl.pathname.startsWith('/host');
            const isOnHostOnboarding = nextUrl.pathname.startsWith('/host/onboarding');

            // Admin Routes
            if (isOnAdmin) {
                if (isLoggedIn && auth.user.role === 'admin') return true;
                return false; // Redirect unauthenticated or non-admin
            }

            // Host Routes
            if (isOnHost) {
                if (isOnHostOnboarding) return true; // Allow anyone to access onboarding (logic inside component can handle redirect if already host)

                if (isLoggedIn && auth.user.role === 'host') return true;
                return false;
            }

            return true;
        },
    },
    providers: [], // Configured in auth.js
};
