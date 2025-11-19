import Link from "next/link";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import AdminNavbar from "../components/adminNavbar";
import AddProduct from "../components/AddProduct";

const AdminPage = async () => {
    const session =await auth();
    if(!session){
        redirect('/login');
    }
    return ( 
    <div>
       {session?(<><AdminNavbar/><AddProduct/></>)
       :
       (<h1>Not Authorized</h1>)
       }
       
        
    </div> 
        );
}
 
export default AdminPage;