import { redirect } from "next/navigation";
import { auth } from "./auth";
import DBConnection from "./utils/config/db";
import UserNavigation from "./components/UserNavigation";
import AdminPage from "./admin/page";
import Carousel from "./components/carouselElement";
// import ProductCollection from "./components/ProductCollection";
import LocationCollection from "./components/LocationCollection";
import Image from "next/image";
import RandomHeroVideo from "./components/carouselElement";
import Carousel2 from "./components/Carousel2";


 
const HomePage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const role = session.user.role;

  return (
    <div>
      {/* USER + HOST SEE SAME HOME */}
      {(role === "user" || role === "host") && (
        <>
          <UserNavigation />
          <RandomHeroVideo />
          <LocationCollection />
        </>
      )}

      {/* ADMIN ONLY */}
      {role === "admin" && <AdminPage />}
    </div>
  );
};

export default HomePage;
