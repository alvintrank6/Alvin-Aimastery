import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ContactPage from "../pages/contact/page";
import ServicePage from "../pages/services/ServicePage";
import Register from "../pages/developer/Register";
import MemberPortal from "../pages/member/MemberPortal";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Login from "../pages/auth/Login";
import RegisterSelection from "../pages/auth/RegisterSelection";
import ClientPortal from "../pages/client/ClientPortal";
import ClientRegister from "../pages/client/ClientRegister";
import AboutPage from "../pages/about/page";
import ProjectsPage from "../pages/projects/page";
import PromptsPage from "../pages/prompts/page";
import BlogPage from "../pages/blog/page";
import BlogPostDetail from "../pages/blog/BlogPostDetail";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/prompts",
    element: <PromptsPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:postId",
    element: <BlogPostDetail />,
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
    path: "/client/register",
    element: <ClientRegister />,
  },
  {
    path: "/member-portal",
    element: <MemberPortal />,
  },
  {
    path: "/client-portal",
    element: <ClientPortal />,
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