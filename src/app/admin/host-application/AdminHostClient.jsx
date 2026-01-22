'use client';

export default function AdminHostClient({ applications }) {

    const handleApprove = async (applicationId) => {
        try {
            const res = await fetch('/api/admin/approve-host', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Application approved successfully');
                window.location.reload();
            } else {
                alert(data.message || 'Failed to approve application');
            }
        } catch (error) {
            console.error("Approval error:", error);
            alert("An error occurred while approving.");
        }
    }

    const handleReject = async (applicationId) => {
        try {
            const res = await fetch('/api/admin/reject-host', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Application rejected successfully');
                window.location.reload();
            } else {
                alert(data.message || 'Failed to reject application');
            }
        } catch (error) {
            console.error("Rejection error:", error);
            alert("An error occurred while rejecting.");
        }
    }

    return (
        <div>
            <h1>Host Applications</h1>
            {applications.map(app => (
                <div key={app._id} style={{ border: "1px solid #ccc", padding: 16, margin: 16 }}>
                    <p><strong>User:</strong> {app.userId.username}</p>
                    <p><strong>Email:</strong> {app.userId.email}</p>
                    <p><strong>Property:</strong> {app.propertyName}</p>
                    <p><strong>City:</strong> {app.city}</p>

                    <button onClick={() => handleApprove(app._id)}>
                        Approve
                    </button>

                    <button onClick={() => handleReject(app._id)}>
                        Reject
                    </button>
                </div>
            ))}
        </div>
    )
}