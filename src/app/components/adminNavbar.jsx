import Link from 'next/link';

const AdminNavbar = () => {
  return (
    <div className='navSection'>
      <div className="title">
        <Link href="/" className="link">
          <h2>Holiday Resort</h2>
        </Link>
      </div>

      <div className="navLinksContainer">
        <Link href="/admin/Approve-host-property" className="link">
          Approve Properties
        </Link>
        <Link href="/admin/manage-locations" className="link">
          Manage Locations
        </Link>
      </div>

      <div className="adminProfileContainer">
        <p>Welcome: Admin</p>
        <Link href="/api/auth/signout" className='link'>
          <div className="logout">
            Logout
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminNavbar;