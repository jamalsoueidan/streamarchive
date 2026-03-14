import { Box } from "@mantine/core";
import { Header } from "../(public)/components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      display="flex"
      style={{ flexDirection: "column", position: "relative", zIndex: 1 }}
    >
      <Header />

      {children}
    </Box>
  );
}
