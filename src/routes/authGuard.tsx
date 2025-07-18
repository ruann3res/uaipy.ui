import { useAuth } from "@/hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

export function AuthGuard({ isPrivate }: { isPrivate: boolean }){
    const { signedIn } = useAuth()
  
    if(isPrivate && !signedIn) {
      return <Navigate to="/auth" replace />
    }
  
    if(!isPrivate && signedIn) {
      return <Navigate to="/" replace />
    }

    return <Outlet />
  }
  
  