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
        leftSection={<IconSearch size={16} color="#52FF94" />}
        size="md"
        readOnly
        onClick={open}
        style={{ cursor: "pointer" }}
        styles={{
          input: {
            cursor: "pointer",
            borderRadius: 9999,
            border: "1px solid #54ff5b",
            "--input-placeholder-color": "#54ff5b",
            background:
              "linear-gradient(70deg, #262626 40.41%, #1ed760 216.15%)",
          } as React.CSSProperties,
        }}
      />
      <SearchCreatorModal opened={opened} onClose={close} />
    </>
  );
}
