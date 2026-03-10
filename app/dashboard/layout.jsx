export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

import DashboardClientLayout from "./DashboardClientLayout";

export default function Layout({ children }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}