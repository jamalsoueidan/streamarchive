import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

const agent = new https.Agent({
  maxSockets: 200,
  keepAlive: true,
  keepAliveMsecs: 1000,
});

export const s3Nbg1 = new S3Client({
  region: "nbg1",
  endpoint: "https://nbg1.your-objectstorage.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    connectionTimeout: 10000,
    requestTimeout: 30000,
  }),
});

export function getS3(): S3Client {
  return s3Nbg1;
}

const MEDIA_PROXY_HOST = process.env.MEDIA_PROXY_HOST;

export function proxySignedUrl(url: string): string {
  if (!MEDIA_PROXY_HOST) return url;
  return url.replace("nbg1.your-objectstorage.com", MEDIA_PROXY_HOST);
}

export function getBucket(
  bucket: string,
  sourceBucket?: string | null,
): string {
  return sourceBucket || `${bucket}-nbg`;
}
