import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ContactPage from "../pages/contact/page";
import ServicePage from "../pages/services/ServicePage";
import Register from "../pages/developer/Register";
import ClientPortal from "../pages/client/ClientPortal";
import MemberPortal from "../pages/member/MemberPortal";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Login from "../pages/auth/Login";
import RegisterSelection from "../pages/auth/RegisterSelection";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/services/:serviceId",
    element: <ServicePage />,
  },
  {
    path: "/developer/register",
    element: <Register />,
  },
  {
    path: "/client-portal",
    element: <ClientPortal />,
  },
  {
    path: "/member-portal",
    element: <MemberPortal />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterSelection />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;