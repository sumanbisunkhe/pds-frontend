import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";
import logoImg from "@/assets/logo.png";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "My Photos", href: "/my-photos" },
    { label: "Register", href: "/register" },
    { label: "About", href: "/about" },
  ];

  const logo = (
    <img
      src={logoImg}
      alt="foto"
      className="w-full h-full object-contain scale-150"
    />
  );

  return (
    <PillNav
      logo={logo}
      items={navItems}
      activeHref={location.pathname}
      baseColor="#09090b" // Zinc 950
      pillColor="#ffffff" // White
      pillTextColor="#09090b"
      hoveredPillTextColor="#ffffff"
    />
  );
}
