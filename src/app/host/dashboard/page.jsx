import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function HostDasboard() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'host') {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Application Submitted</h1>
                <p>Your host application is currently <strong>PENDING</strong> approval.</p>
                <p>Please check back later or contact the admin.</p>
                <br />
                <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Return Home</a>
            </div>
        );
    }

    return (
        <div>
            <h1>Host Dashboard</h1>

            <a href='/host/add-hotel'>Add Hotel</a><br />
            <a href='/host/my-hotels'>My Hotels</a>
        </div>
    );
}