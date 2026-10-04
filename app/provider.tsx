"use client"
import { UserDetailContext } from "@/Context/userDetailContext";
import axios from "axios"
import { useEffect, useState } from "react";

export default function Provider({children}:{children:React.ReactNode}){
    const [userDetail,setUserDetail]=useState();

    useEffect(()=>{
       CreateNewUser();
    },[])

    const CreateNewUser=async()=>{
       const result = await axios.post("/api/user");
       console.log(result.data)
       setUserDetail(result.data);
    }
    return (
         <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
             <div>{children}</div>
         </UserDetailContext.Provider>
    )
}