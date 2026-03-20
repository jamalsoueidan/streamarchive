"use client";

import { SearchCreatorModal } from "@/app/[locale]/(protected)/components/search-creator-modal";
import { TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function SearchCreator() {
  const t = useTranslations("protected.search");
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <TextInput
        placeholder={t("search.enterUsername")}
        leftSection={<IconSearch size={16} />}
        size="sm"
        radius="md"
        readOnly
        onClick={open}
        style={{ cursor: "pointer" }}
        styles={{ input: { cursor: "pointer" } }}
      />
      <SearchCreatorModal opened={opened} onClose={close} />
    </>
  );
}
