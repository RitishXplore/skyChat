import { Suspense, lazy } from "react"; // Used to show a loading screen until the component is loaded
import { Navigate, useRoutes } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";

// Config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import Cookies from "js-cookie"; // Cookie management for checking if the user is logged in

// A helper function to check if the user is authenticated
const isAuthenticated = () => {
  const token = Cookies.get("token"); // Check for the JWT token in cookies
  return token ? true : false; // Return true if token exists, otherwise false
};

// Custom wrapper to load components lazily with a loading screen
const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/auth',
      element: <MainLayout />,
      children: [
        { 
          element: isAuthenticated() ? <Navigate to="/app" replace /> : <LoginPage />, 
          path: 'login' 
        },
        { 
          element: isAuthenticated() ? <Navigate to="/app" replace /> : <RegisterPage />, 
          path: 'register' 
        },
        { element: <ResetPasswordPage />, path: 'reset-password' },
        { element: <NewPasswordPage />, path: 'new-password' },
      ]
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <ProtectedRoute component={GeneralApp} /> },
        { path: "settings", element: <ProtectedRoute component={Settings} /> },
        { path: "group", element: <ProtectedRoute component={GroupPage} /> },
        { path: "call", element: <ProtectedRoute component={CallPage} /> },
        { path: "profile", element: <ProtectedRoute component={ProfilePage} /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// Protected Route Wrapper
const ProtectedRoute = ({ component: Component }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />; // Redirect to login if not authenticated
  }
  return <Component />; // Render the component if authenticated
};

// Lazily loaded components
const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const GroupPage = Loadable(lazy(() => import("../pages/dashboard/Group")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/Profile")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
