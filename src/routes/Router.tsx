import { DashboardLayout } from "@/components/Layouts"
import { NotFound } from "@/pages/NotFound"
import { Route, Routes } from "react-router-dom"
import { AuthGuard } from "./authGuard"
import { BlockedUserGuard } from "./blockedUserGuard"
import { SignUp, SignIn } from "@/pages/Auth"
import { ProjectForm, Projects } from "@/pages/Projects"
import { Devices } from "@/pages/Devices"
import { DeviceForm } from "@/pages/Devices/DeviceForm"
import { Sensor } from "@/pages/Sensor/Sensor"
import { SensorForm } from "@/pages/Sensor/SensorForm"
import { Reports } from "@/pages/Reports"
import { Home } from "@/pages/Home"

export const Router = () => {
  return (
    <Routes >
      <Route element={<AuthGuard isPrivate={false} />}>
        <Route path="/auth" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Route>

      <Route element={<AuthGuard isPrivate={true} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<BlockedUserGuard />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/form" element={<ProjectForm />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/form" element={<DeviceForm />} />
            <Route path="/sensors" element={<Sensor />} />
            <Route path="/sensors/form" element={<SensorForm />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
          
        </Route>
      </Route>
    </Routes>
  )
}