"use client";

import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  useMatches,
} from "@mantine/core";
import {
  IconBell,
  IconCheck,
  IconStar,
  IconDownload,
  IconHeadset,
  IconScissors,
  IconUsers,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const DISCOUNT_CODE = "FIRST25";

interface CreatorUpgradeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreatorUpgradeModal({
  opened,
  onClose,
}: CreatorUpgradeModalProps) {
  const t = useTranslations("protected.common");
  const tp = useTranslations("protected.premium");

  const isMobile = useMatches({ base: true, sm: false });
  const handleClose = () => {
    onClose();
  };

  const features = [
    { icon: IconUsers, label: tp("premiumRecord100") },
    { icon: IconDownload, label: tp("premiumFullControl") },
    { icon: IconBell, label: tp("premiumNotifications") },
    { icon: IconScissors, label: tp("premiumClipEditor") },
    { icon: IconVideo, label: tp("premiumWatchLater") },
    { icon: IconDownload, label: tp("premiumDownloadRecordings") },
    { icon: IconHeadset, label: tp("premiumPrioritySupport") },
  ];

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      padding={0}
      withCloseButton={false}
      radius="lg"
      size="lg"
      centered
      styles={{
        content: {
          border: "1px solid rgba(82, 255, 148, 0.3)",
        },
      }}
    >
      {/* Gradient header */}
      <Box
        p={isMobile ? "md" : "xl"}
        style={{
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          borderRadius: "var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0",
          position: "relative",
        }}
      >
        <ActionIcon
          pos="absolute"
          top={12}
          right={12}
          variant="subtle"
          color="white"
          onClick={handleClose}
        >
          <IconX size={18} />
        </ActionIcon>

        <Stack align="center" gap="xs">
          <IconStar size={44} color="#fbbf24" />
          <Title order={2} c="white" ta="center" size={isMobile ? "h4" : "h3"}>
            {t("followers.max3Message")}
          </Title>
        </Stack>
      </Box>

      {/* Body */}
      <Stack gap="md" p="lg">
        {/* Features grid */}
        <Stack gap="xs">
          <Text fw={600} size="sm" c="dimmed">
            {tp("unlockPremiumFeatures")}
          </Text>
          <Grid gutter="xs">
            {features.map((f) => (
              <GridCol span={6} key={f.label}>
                <Group gap={6} wrap="nowrap">
                  <IconCheck size={16} color="#52FF94" style={{ flexShrink: 0 }} />
                  <Text size="xs">{f.label}</Text>
                </Group>
              </GridCol>
            ))}
          </Grid>
        </Stack>

        {/* Discount section */}
        <Paper
          p="sm"
          radius="md"
          style={{
            background: "rgba(27, 147, 69, 0.08)",
            border: "1px solid rgba(82, 255, 148, 0.3)",
          }}
        >
          <Flex justify="space-between" align="center" gap="sm" wrap="nowrap">
            <Stack gap={2}>
              <Group gap="xs">
                {!isMobile ? (
                  <Badge color="green" variant="filled" size="sm">
                    25% OFF
                  </Badge>
                ) : null}
                <Text size="sm" fw={600}>
                  {t("followers.upgradeModalDiscount")}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {t("followers.upgradeModalCodeNote")}
              </Text>
            </Stack>
            <Paper
              px="sm"
              py={6}
              radius="sm"
              style={{
                background: "rgba(27, 147, 69, 0.15)",
                border: "1px dashed rgba(82, 255, 148, 0.6)",
                flexShrink: 0,
              }}
            >
              <Text
                fw={700}
                size="sm"
                c="green"
                style={{ fontFamily: "monospace", letterSpacing: "0.12em" }}
              >
                {DISCOUNT_CODE}
              </Text>
            </Paper>
          </Flex>
        </Paper>

        {/* CTA */}
        <Button
          component={Link}
          href="/premium"
          onClick={() => {
            onClose();
          }}
          fullWidth
          size={isMobile ? "md" : "lg"}
          radius={isMobile ? "lg" : "xl"}
          leftSection={<IconStar size={18} color="#fbbf24" />}
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          }}
        >
          {t("followers.upgradeButton")}
        </Button>

        <Text ta="center" size="xs" c="dimmed">
          {tp("supportMessage")}
        </Text>
      </Stack>
    </Modal>
  );
}
