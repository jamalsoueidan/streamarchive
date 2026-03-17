"use client";

import { login } from "@/app/actions/auth";
import { getFacebookAuthUrl } from "@/app/actions/facebook";
import { getGoogleAuthUrl } from "@/app/actions/google";
import { getTikTokAuthUrl } from "@/app/actions/tiktok";
import { trackEvent } from "@/app/lib/analytics";
import {
  Anchor,
  Button,
  Container,
  Divider,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTiktok,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

export function LoginChoices() {
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const [tiktokLoading, setTiktokLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const error = searchParams.get("error");
  const emailConfirmed = searchParams.get("email-confirmed") === "true";
  const [state, formAction, pending] = useActionState(login, null);

  const handleTikTokLogin = async () => {
    trackEvent("login_method", { method: "tiktok" });
    setTiktokLoading(true);
    const url = await getTikTokAuthUrl("login");
    window.location.href = url;
  };

  const handleGoogleLogin = async () => {
    trackEvent("login_method", { method: "google" });
    setGoogleLoading(true);
    const url = await getGoogleAuthUrl("login");
    window.location.href = url;
  };

  const handleFacebookLogin = async () => {
    trackEvent("login_method", { method: "facebook" });
    setFacebookLoading(true);
    const url = await getFacebookAuthUrl("login");
    window.location.href = url;
  };

  return (
    <>
      <Container size="sm">
        <Stack align="center" gap={16} mb={48}>
          <Title
            order={1}
            ta="center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(82, 255, 148, 0.3))",
            }}
          >
            {t("title")}
          </Title>

          <Text
            size="xl"
            ta="center"
            maw={600}
            style={{ color: "#94a3b8", lineHeight: 1.7 }}
          >
            {t("subtitle")}
          </Text>
        </Stack>
      </Container>
      <Container size="xs">
        <Paper
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Stack gap="md">
            {error === "email_taken" && (
              <Text
                size="sm"
                ta="center"
                p="sm"
                style={{
                  color: "#f87171",
                  background: "rgba(248, 113, 113, 0.1)",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  borderRadius: 8,
                }}
              >
                {t("errors.emailTaken")}
              </Text>
            )}

            {emailConfirmed && (
              <Paper
                p="md"
                radius="md"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <Text size="sm" style={{ color: "#6ee7b7" }}>
                  {t("emailConfirmed")}
                </Text>
              </Paper>
            )}

            {state?.error && (
              <Paper
                p="md"
                radius="md"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <Text size="sm" style={{ color: "#fca5a5" }}>
                  {state.error}
                </Text>
              </Paper>
            )}

            <form action={formAction}>
              <Stack gap="lg">
                <TextInput
                  name="email"
                  type="email"
                  label={t("email.label")}
                  placeholder={t("email.placeholder")}
                  required
                  leftSection={
                    <IconMail size={18} style={{ color: "#64748b" }} />
                  }
                  styles={{
                    label: { color: "#f1f5f9", marginBottom: 8 },
                    input: {
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#f1f5f9",
                      height: 48,
                    },
                  }}
                />

                <PasswordInput
                  name="password"
                  label={t("password.label")}
                  placeholder={t("password.placeholder")}
                  required
                  leftSection={
                    <IconLock size={18} style={{ color: "#64748b" }} />
                  }
                  styles={{
                    label: { color: "#f1f5f9", marginBottom: 8 },
                    input: {
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#f1f5f9",
                      height: 48,
                    },
                    innerInput: {
                      color: "#f1f5f9",
                    },
                  }}
                />

                <Flex justify="flex-end">
                  <Anchor
                    component={Link}
                    href="/forgot-password"
                    size="sm"
                    style={{ color: "#52FF94" }}
                  >
                    {t("forgotPassword")}
                  </Anchor>
                </Flex>

                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  loading={pending}
                  variant="gradient"
                  gradient={{ from: "#54ff5b", to: "#b7ff6b", deg: 135 }}
                  c="black"
                  fullWidth
                  style={{ fontWeight: 600, height: 48 }}
                >
                  {pending ? t("submit.loading") : t("submit.default")}
                </Button>
              </Stack>
            </form>

            <Divider
              label={t("choices.or") || "OR"}
              labelPosition="center"
              color="dark.4"
              my="xs"
            />

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandGoogle />}
              loading={googleLoading}
              onClick={handleGoogleLogin}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.google")}
            </Button>

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandTiktok />}
              loading={tiktokLoading}
              onClick={handleTikTokLogin}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.tiktok")}
            </Button>

            <Button
              size="lg"
              radius="md"
              fullWidth
              leftSection={<IconBrandFacebook />}
              loading={facebookLoading}
              onClick={handleFacebookLogin}
              style={{
                fontWeight: 600,
                height: 48,
                background: "#ffffff",
                color: "#1f1f1f",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {t("choices.facebook")}
            </Button>

            <Text ta="center" mt="xs" style={{ color: "#64748b" }}>
              {t("register.text")}{" "}
              <Anchor
                component={Link}
                href="/register"
                style={{ color: "#52FF94", fontWeight: 500 }}
              >
                {t("register.link")}
              </Anchor>
            </Text>
          </Stack>
        </Paper>

        <Text
          ta="center"
          mt="xl"
          size="xs"
          maw={400}
          mx="auto"
          style={{ color: "#64748b", lineHeight: 1.6 }}
        >
          {t("terms.text")}{" "}
          <Anchor component={Link} href="/terms" style={{ color: "#52FF94" }}>
            {t("terms.tosLink")}
          </Anchor>{" "}
          {t("terms.and")}{" "}
          <Anchor component={Link} href="/privacy" style={{ color: "#52FF94" }}>
            {t("terms.privacyLink")}
          </Anchor>
        </Text>
      </Container>
    </>
  );
}
