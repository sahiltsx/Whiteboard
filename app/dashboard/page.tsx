import { UserButton } from "@clerk/nextjs";

export default function Dashboard(){
    return(
        <div className="m-4">
            <UserButton/>
        </div>
    )
}