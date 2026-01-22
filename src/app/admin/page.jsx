import Link from "next/link";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import AdminNavbar from "../components/adminNavbar";
import AddProduct from "../components/AddProduct";
import AddLocation from "../components/AddLocation";

const AdminPage = async () => {
    const session =await auth();
    if(!session){
        redirect('/login');
    }
    return ( 
    <div>
       {session?(<><AdminNavbar/><AddProduct/><AddLocation/></>)
       :
       (<h1>Not Authorized</h1>)
       }
       
        
    </div> 
        );
}
 
export default AdminPage;
