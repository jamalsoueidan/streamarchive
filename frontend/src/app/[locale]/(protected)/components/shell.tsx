"use client";

import { useNavbarCollapsed } from "@/app/hooks/use-navbar-collapsed";
import { IsNewProvider } from "@/app/providers/is-new-provider";
import { AppShell, useMatches } from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";

import { Header } from "./header";
import { MobileBar } from "./mobilebar";
import { Navbar } from "./navbar";

const NAVBAR_WIDTH_EXPANDED = 120;
const ANDROID_TEST_CUTOFF = new Date("2026-03-10T00:00:00Z");

export function Shell({
  children,
  initialCollapsed = false,
}: {
  children: React.ReactNode;
  initialCollapsed?: boolean;
}) {
  const [opened, { close, open }] = useDisclosure(false);
  const { collapsed, toggle } = useNavbarCollapsed(initialCollapsed);

  // mount and headerHeight is fix for SSR and the video player page
  const mounted = useMounted();
  const headerHeight = useMatches({
    base: 55,
    sm: 0,
  });

  return (
    <IsNewProvider>
      <AppShell
        header={{ height: 50 }}
        styles={{
          footer: !headerHeight
            ? {
                display: "none",
              }
            : {},
          navbar: {
            transition: "width 200ms ease",
          },
        }}
        footer={{
          height: mounted ? headerHeight : 0,
          collapsed: headerHeight === 0,
        }}
        navbar={{
          width: NAVBAR_WIDTH_EXPANDED,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        withBorder={false}
      >
        <AppShell.Header bg="unset">
          <Header />
        </AppShell.Header>

        <AppShell.Navbar>
          <Navbar opened={opened} close={close} collapsed={collapsed} />
        </AppShell.Navbar>
        <AppShell.Main mt="md" pr="md">
          {children}
        </AppShell.Main>
        <AppShell.Footer>
          <MobileBar />
        </AppShell.Footer>
      </AppShell>
    </IsNewProvider>
  );
}
