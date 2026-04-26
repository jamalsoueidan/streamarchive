import Hls, { FetchLoader } from "hls.js";

let configured = false;

export function configureHls() {
  if (configured) return;
  configured = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.fLoader = FetchLoader as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hls.DefaultConfig.pLoader = FetchLoader as any;
}
