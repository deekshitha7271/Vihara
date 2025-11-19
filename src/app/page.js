import { redirect } from "next/navigation";
import { auth } from "./auth";
import DBConnection from "./utils/config/db";
import UserNavigation from "./components/UserNavigation";
import AdminPage from "./admin/page";
import Carousel from "./components/carouselElement";
import ProductCollection from "./components/ProductCollection";

const HomePage = async () => {

  const session = await auth();
  if(!session){
    redirect('/login');
  }
  const userName=session.username;
  
  console.log("role check:",session.role )
  console.log('user check:',userName);
  
  await DBConnection();
  return ( <div>
    {session.role==='user' &&( <>
    <UserNavigation userName={userName}/>
    <Carousel/>
    <ProductCollection/>

    </>)}
    {session.role==='admin' && (
      
      <AdminPage/>
    )
    }
    
  </div> );
}
 
export default HomePage;