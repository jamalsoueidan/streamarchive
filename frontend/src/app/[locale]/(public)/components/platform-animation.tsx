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
          p="sm"
          radius="md"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            border: `1px solid ${p.colorCss}`,
            boxShadow: `0 0 12px ${p.colorCss}, inset 0 0 8px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className={styles.icon}
            style={{
              backgroundColor: p.colorCss,
              maskImage: `url(${p.file})`,
              WebkitMaskImage: `url(${p.file})`,
            }}
          />
          <Text size="xs" ta="center" c="dimmed" mt={4} style={{ whiteSpace: "nowrap" }}>
            {p.name}
          </Text>
        </Card>
      ))}
    </div>
  );
}
