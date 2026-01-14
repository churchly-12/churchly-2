import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import AdminLayout from "./components/AdminLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/users/Home";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Devotions from "./pages/users/Devotions";
import Rosary from "./pages/users/Rosary";
import DivineMercy from "./pages/users/DivineMercy";
import StationsOfTheCross from "./pages/users/StationsOfTheCross";
import Novenas from "./pages/users/Novenas";
import DailyReadings from "./pages/users/DailyReadings";
import ShortPrayers from "./pages/users/ShortPrayers";
import FastingGuide from "./pages/users/FastingGuide";
import LiturgyCalendar from "./pages/users/LiturgyCalendar";
import Activities from "./pages/users/Activities";
import YouthGroups from "./pages/users/YouthGroups";
import Meditation from "./pages/users/Meditation";
import Settings from "./pages/users/Settings";
import PrayerWall from "./pages/users/PrayerWall";
import NewPrayerRequest from "./pages/users/NewPrayerRequest";
import Testimonials from "./pages/users/Testimonials";
import NewTestimonial from "./pages/users/NewTestimonial";
import CommunityPage from "./pages/users/CommunityPage";
import Profile from "./pages/users/Profile";
import MyPrayerRequests from "./pages/users/MyPrayerRequests";
import EditFullName from "./pages/users/edit/EditFullName";
import EditEmail from "./pages/users/edit/EditEmail";
import EditPhone from "./pages/users/edit/EditPhone";
import EditDOB from "./pages/users/edit/EditDOB";
import EditAddress from "./pages/users/edit/EditAddress";
import EditFamilyID from "./pages/users/edit/EditFamilyID";
import EditCommunityZone from "./pages/users/edit/EditCommunityZone";
import ChangePassword from "./pages/users/settings/ChangePassword";
import NotificationSettings from "./pages/users/settings/NotificationSettings";
import ContactSupport from "./pages/users/settings/ContactSupport";
import ReportProblem from "./pages/users/settings/ReportProblem";
import DeleteAccount from "./pages/users/settings/DeleteAccount";
import Logout from "./pages/users/settings/Logout";
import MyTestimonials from "./pages/users/settings/MyTestimonials";
// Admin imports
import AdminLanding from "./pages/admin/AdminLanding";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import PrayerManagement from "./pages/admin/PrayerManagement";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminYouthGroups from "./pages/admin/AdminYouthGroups";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogout from "./pages/admin/Logout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Routes>
            {/* User Routes with regular layout */}
            <Route path="/" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Home />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/devotions" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Devotions />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/rosary" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Rosary />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/divine-mercy" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <DivineMercy />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/stations" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <StationsOfTheCross />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/novenas" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Novenas />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/readings" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <DailyReadings />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/fasting-guide" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <FastingGuide />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/liturgy-calendar" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <LiturgyCalendar />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/prayers" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <ShortPrayers />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/activities" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Activities />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/youth-groups" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <YouthGroups />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/meditation" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Meditation />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Settings />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/prayer-wall" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <PrayerWall />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/prayer-wall/new" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <NewPrayerRequest />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/my-prayers" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <MyPrayerRequests />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/testimonials" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Testimonials />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/testimonials/new" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <NewTestimonial />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/community" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <CommunityPage />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/profile" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Profile />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/edit-name" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditFullName />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/edit-email" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditEmail />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/edit-phone" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditPhone />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/edit-dob" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditDOB />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/edit-address" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditAddress />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/family-id" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditFamilyID />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/community-zone" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <EditCommunityZone />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/change-password" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <ChangePassword />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/notifications" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <NotificationSettings />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/contact-support" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <ContactSupport />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/report-problem" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <ReportProblem />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/delete-account" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <DeleteAccount />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/logout" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <Logout />
                </div>
                <BottomNav />
              </>
            } />
            <Route path="/users/settings/my-testimonials" element={
              <>
                <TopBar />
                <div className="p-4 pb-20 min-h-screen bg-[#f7efe6] text-[#3b2a20] pt-20">
                  <MyTestimonials />
                </div>
                <BottomNav />
              </>
            } />

            {/* Admin Routes with AdminLayout */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminLanding />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/roles" element={
              <AdminRoute>
                <AdminLayout>
                  <RoleManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/prayers" element={
              <AdminRoute>
                <AdminLayout>
                  <PrayerManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/activities" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminActivities />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/youth-groups" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminYouthGroups />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/logout" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminLogout />
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <div className="min-h-screen bg-[#f7efe6]">
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/admin-login" element={<AdminLogin />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Routes>
        </div>
      )}
    </>
  );
}
