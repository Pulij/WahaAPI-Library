const { WhatsAppAPI } = require("../dist/client");
const waha = new WhatsAppAPI("fdsdsdf");

waha.on("default", "message", async (ctx) => {
  try {
    let text =
      ctx.payload?.message?.extendedTextMessage?.text ||
      ctx.payload?.message?.conversation;

    if (text?.toLowerCase() === ".restart") {
      await waha.sessions.stopSession(ctx.session);
      await waha.sessions.startSession(ctx.session);
    }

    if (text?.toLowerCase() === ".ping") {
      const startTime = performance.now();
      await waha.messages.sendMessage(ctx.session, ctx.payload.key.remoteJid, {
        text: "Пинг...",
      });
      const endTime = performance.now();
      const ping = Math.round(endTime - startTime);
      await waha.messages.sendMessage(ctx.session, ctx.payload.key.remoteJid, {
        text: `Понг -> ${ping}`,
      });
    }

    console.log(ctx);
  } catch (err) {
    console.error(err);
  }
});
