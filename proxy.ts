
// Bina login ke /dashboard ya /me kholne par seedha /login par bhej dega.

import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: ["/dashboard/:path*", "/me/:path*"],
};
