import toast from "react-hot-toast"
import axios from "axios"
const baseUrl = axios.create({
    baseURL:"http://localhost:3000/"
})
export const registerClient = async(data:any)=>{
    try {
        await baseUrl.post("/auth/registerClient",JSON.stringify({
            username : data.username,
            plan:data.plan
        }),{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return {
            success:true,
            message:"Client registered successfully"
        }
    } catch (error:any) {
        toast.error(error.response.data.message);
    }
}


export const loginClient = async(username:string)=>{
    try {
        const login = await baseUrl.post("/auth/loginClient",JSON.stringify({username}),{
            headers:{
                'Content-Type':'application/json'
            }
        })
        return login.data
    } catch (error:any) {
        toast.error(error.response.data.message);
    }
}

export const downlaodFile=(userId:string)=>{
    try {
        baseUrl.get(`/bandTest/download?userId=${userId}`)
    } catch (error:any) {
        toast.error(error.response.data.message);
    }
}


export function bytesToSpeed(bytes:number) {
    // Step 1: Calculate bits from bytes

    // Step 2: Determine if it should be in Kbps or Mbps
    if (bytes < 1000) {
        return `${bytes} bytes`;
    } else if (bytes > 1024 && bytes < 1024 * 1024) {
        // Convert to Kbps
        const kbps = bytes / 1024;
        return `${kbps.toFixed(2)} Kbps`;
    } else {
        // Convert to Mbps
        const mbps = bytes / (1024 * 1024);
        return `${mbps.toFixed(2)} Mbps`;
    }
}