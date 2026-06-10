import { config } from "./config.js";
import { createApp } from "./app.js";
import { startRealtimeServer } from "./realtime.js";

const app = createApp();

app.listen(config.PORT, () => {
  console.log(`API listening on :${config.PORT}`);
});

startRealtimeServer();
