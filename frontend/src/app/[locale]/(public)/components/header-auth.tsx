"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { redirectLoginUri } from "../login/components/login-form";

type AuthButtonsProps = {
  loginLabel: string;
  signUpLabel: string;
  dashboardLabel: string;
};

export function AuthButtons({
  loginLabel,
  signUpLabel,
  dashboardLabel,
}: AuthButtonsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.isLoggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDashboardLoading(true);
    router.push(redirectLoginUri);
  };

  if (isLoggedIn) {
    return (
      <Button
        component={Link}
        href={redirectLoginUri}
        onClick={handleDashboardClick}
        loading={dashboardLoading}
        variant="outline"
        color="#52FF94"
        c="#52FF94"
        radius="lg"
      >
        {dashboardLabel}
      </Button>
    );
  }

  return (
    <>
      <Button variant="subtle" c="white" component={Link} href="/login">
        {loginLabel}
      </Button>
      <Button
        component={Link}
        href="/register"
        variant="outline"
        color="#52FF94"
        c="#52FF94"
        radius="lg"
      >
        {signUpLabel}
      </Button>
    </>
  );
}
