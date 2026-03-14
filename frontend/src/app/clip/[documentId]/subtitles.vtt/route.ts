import publicApi from "@/lib/public-api";
import { NextRequest } from "next/server";

interface SubtitleEntry {
  text: string;
  start: number;
  end: number;
}

interface Transcript {
  text: string;
  segments: SubtitleEntry[];
}

const MAX_LINE_WIDTH = 42;
const MAX_LINES = 2;
const MAX_CHARS_PER_CUE = MAX_LINE_WIDTH * MAX_LINES; // ~84 chars max per cue

function getCharWidth(char: string): number {
  const code = char.charCodeAt(0);
  if (
    (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf) ||
    (code >= 0x3000 && code <= 0x303f) ||
    (code >= 0x3040 && code <= 0x309f) ||
    (code >= 0x30a0 && code <= 0x30ff) ||
    (code >= 0xac00 && code <= 0xd7af) ||
    (code >= 0xff00 && code <= 0xffef)
  ) {
    return 2;
  }
  return 1;
}

function getStringWidth(str: string): number {
  return [...str].reduce((width, char) => width + getCharWidth(char), 0);
}

function wrapText(text: string, maxWidth: number, locale: string): string[] {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const segments = [...segmenter.segment(text)];

  const lines: string[] = [];
  let currentLine = "";

  for (const { segment } of segments) {
    const testLine = currentLine + segment;

    if (getStringWidth(testLine) <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = segment;
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
}

/**
 * Split segments into chunks that fit in MAX_LINES lines
 */
function splitIntoChunks(
  text: string,
  start: number,
  end: number,
  locale: string,
): SubtitleEntry[] {
  const lines = wrapText(text, MAX_LINE_WIDTH, locale);
  const duration = end - start;

  // If fits in MAX_LINES, return as-is
  if (lines.length <= MAX_LINES) {
    return [{ text: lines.join("\n"), start, end }];
  }

  // Split into chunks of MAX_LINES lines each
  const chunks: SubtitleEntry[] = [];
  const totalLines = lines.length;
  let currentTime = start;

  for (let i = 0; i < totalLines; i += MAX_LINES) {
    const chunkLines = lines.slice(i, i + MAX_LINES);
    const chunkText = chunkLines.join("\n");

    // Distribute time proportionally
    const chunkDuration = (chunkLines.length / totalLines) * duration;

    chunks.push({
      text: chunkText,
      start: currentTime,
      end: currentTime + chunkDuration,
    });

    currentTime += chunkDuration;
  }

  return chunks;
}

/**
 * Split long Whisper segments into smaller, readable chunks (max 2 lines each)
 */
function splitLongSegments(
  segments: SubtitleEntry[],
  locale: string,
): SubtitleEntry[] {
  const result: SubtitleEntry[] = [];

  for (const segment of segments) {
    const chunks = splitIntoChunks(
      segment.text,
      segment.start,
      segment.end,
      locale,
    );
    result.push(...chunks);
  }

  return result;
}

function jsonToVtt(subtitles: SubtitleEntry[], locale: string): string {
  let vtt = "WEBVTT\n\n";

  // Split long segments into max 2-line chunks
  const processedSubtitles = splitLongSegments(subtitles, locale);

  processedSubtitles.forEach((entry) => {
    const startTime = secondsToVtt(entry.start);
    const endTime = secondsToVtt(entry.end);

    vtt += `${startTime} --> ${endTime} line:85%\n`;
    vtt += `${entry.text}\n\n`;
  });

  return vtt;
}

function secondsToVtt(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${secs.padStart(6, "0")}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  const { data } = await publicApi.clip.getClipsId(
    {
      id: documentId,
    },
    { query: { locale } } as any,
  );

  if (!data.data) {
    return new Response("Not found", { status: 404 });
  }

  const clip = data.data;
  const transcript = clip.transcript as Transcript | null;

  if (!transcript?.segments?.length) {
    return new Response("No subtitles available", { status: 404 });
  }

  const vttContent = jsonToVtt(transcript.segments, locale);

  return new Response(vttContent, {
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
