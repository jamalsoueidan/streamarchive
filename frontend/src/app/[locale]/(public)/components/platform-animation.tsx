import { streamingPlatforms } from "@/app/lib/streaming-platforms";
import { Card, Text } from "@mantine/core";
import styles from "./platform-animation.module.css";

export function PlatformAnimation() {
  return (
    <div className={styles.container}>
      {streamingPlatforms.filter((p) => p.name !== "YouTube").map((p) => (
        <Card
          key={p.name}
          className={styles.card}
          withBorder
          p="sm"
          radius="md"
        >
          <div
            className={styles.icon}
            style={{
              backgroundColor: p.colorCss,
              maskImage: `url(${p.file})`,
              WebkitMaskImage: `url(${p.file})`,
            }}
          />
          <Text size="xs" ta="center" c="dimmed" mt={4}>
            {p.name}
          </Text>
        </Card>
      ))}
    </div>
  );
}
