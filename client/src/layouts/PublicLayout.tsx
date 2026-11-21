import LenisScroll from "../components/lenis-scroll";
import { Navbar } from "../components/navbar";
import { Outlet } from "react-router";
import { Footer } from "../components/footer";

const PublicLayout = () => {
  return (
    <>
      <LenisScroll />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
