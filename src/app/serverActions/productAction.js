'use server'

import DBConnection from "../utils/config/db"

export async function productAction(productDetails){
    await DBConnection();
    console.log("Product Details:",productDetails);

}