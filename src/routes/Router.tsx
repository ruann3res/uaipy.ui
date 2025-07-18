import { DashboardLayout } from "@/components/Layouts"
import { NotFound } from "@/pages/NotFound"
import { Route, Routes } from "react-router-dom"
import { AuthGuard } from "./authGuard"
import { SignUp,SignIn } from "@/pages/Auth"

export const Router = () => {
  return (
    <Routes >
      <Route element={<AuthGuard isPrivate={false} />}>
        <Route path="/auth" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Route>

      <Route element={<AuthGuard isPrivate={true} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Página Geral</h1>
              <p>Bem-vindo ao UaiPy!</p>
            </div>
          } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
    </Routes>
  )
}