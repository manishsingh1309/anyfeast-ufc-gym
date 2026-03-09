import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GymProvider } from "./context/GymContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TrainerLayout } from "./layouts/TrainerLayout";
import { OwnerLayout } from "./layouts/OwnerLayout";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import { LoginPage } from "./modules/auth/LoginPage";
import { OtpPage } from "./modules/auth/OtpPage";
import { PostLoginRedirect } from "./modules/auth/PostLoginRedirect";
import { GymSelectionPage } from "./modules/gym-selection/GymSelectionPage";
import { TrainerDashboard } from "./modules/trainer/TrainerDashboard";
import { TrainerMembersPage } from "./modules/trainer/TrainerMembersPage";
import { OnboardMemberPage } from "./modules/trainer/OnboardMemberPage";
import { TrainerCouponsPage } from "./modules/trainer/TrainerCouponsPage";
import { TrainerNutritionPlansPage } from "./modules/trainer/TrainerNutritionPlansPage";
import { OwnerDashboard } from "./modules/owner/OwnerDashboard";
import { OwnerLicensesPage } from "./modules/owner/OwnerLicensesPage";
import { OwnerGymsPage } from "./modules/owner/OwnerGymsPage";
import { OwnerTrainersPage } from "./modules/owner/OwnerTrainersPage";
import { OwnerMembersPage } from "./modules/owner/OwnerMembersPage";
import { OwnerNutritionPlansPage } from "./modules/owner/OwnerNutritionPlansPage";
import { OwnerAnalyticsPage } from "./modules/owner/OwnerAnalyticsPage";
import { SuperAdminDashboard } from "./modules/superAdmin/SuperAdminDashboard";
import { SuperAdminGymsPage } from "./modules/superAdmin/SuperAdminGymsPage";
import { SuperAdminTrainersPage } from "./modules/superAdmin/SuperAdminTrainersPage";
import { SuperAdminMembersPage } from "./modules/superAdmin/SuperAdminMembersPage";
import { SuperAdminAnalyticsPage } from "./modules/superAdmin/SuperAdminAnalyticsPage";
import { NotFoundPage } from "./modules/common/NotFoundPage";
import { SettingsPage } from "./modules/common/SettingsPage";
import { MemberLayout } from "./layouts/MemberLayout";
import { MemberDashboard } from "./modules/member/MemberDashboard";
import { MemberMembershipPage } from "./modules/member/MemberMembershipPage";
import { MemberNutritionPage } from "./modules/member/MemberNutritionPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <GymProvider>
            <ToastProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/otp" element={<OtpPage />} />
              <Route path="/post-login" element={<ProtectedRoute><PostLoginRedirect /></ProtectedRoute>} />
              <Route path="/gym-selection" element={<ProtectedRoute allowedRoles={["trainer"]}><GymSelectionPage /></ProtectedRoute>} />

              <Route path="/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<TrainerDashboard />} />
                <Route path="members" element={<TrainerMembersPage />} />
                <Route path="onboard" element={<OnboardMemberPage />} />
                <Route path="coupons" element={<TrainerCouponsPage />} />
                <Route path="nutrition" element={<TrainerNutritionPlansPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/owner" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="licenses" element={<OwnerLicensesPage />} />
                <Route path="gyms" element={<OwnerGymsPage />} />
                <Route path="trainers" element={<OwnerTrainersPage />} />
                <Route path="members" element={<OwnerMembersPage />} />
                <Route path="nutrition" element={<OwnerNutritionPlansPage />} />
                <Route path="analytics" element={<OwnerAnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/member" element={<ProtectedRoute allowedRoles={["member"]}><MemberLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="membership" element={<MemberMembershipPage />} />
                <Route path="nutrition" element={<MemberNutritionPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/admin" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="gyms" element={<SuperAdminGymsPage />} />
                <Route path="trainers" element={<SuperAdminTrainersPage />} />
                <Route path="members" element={<SuperAdminMembersPage />} />
                <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </ToastProvider>
          </GymProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
