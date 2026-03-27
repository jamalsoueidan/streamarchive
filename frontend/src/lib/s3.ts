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
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    connectionTimeout: 5000,
    requestTimeout: 15000,
  }),
});

export const s3Avatar = new S3Client({
  region: process.env.HEXABYTE_REGION || "ume1",
  endpoint: process.env.HEXABYTE_ENDPOINT || "https://s3.hexabyte.se",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.HEXABYTE_ACCESS_KEY!,
    secretAccessKey: process.env.HEXABYTE_SECRET_KEY!,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    connectionTimeout: 5000,
    requestTimeout: 15000,
  }),
});

export function getS3(_createdAt?: Date | string | null): S3Client {
  return s3Nbg1;
}

export function getBucket(
  bucket: string,
  _createdAt?: Date | string | null,
): string {
  return `${bucket}-nbg`;
}
