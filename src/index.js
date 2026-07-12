import "dotenv/config";
import { Client, GatewayIntentBits, Collection, EmbedBuilder } from "discord.js";
import cron from "node-cron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTicker } from "./quvrApi.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsDir = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"))) {
  const mod = await import(path.join(commandsDir, file));
  client.commands.set(mod.data.name, mod);
}

client.once("clientReady", (c) => {
  console.log(`QUVR bot logged in as ${c.user.tag}`);
  scheduleDigest(c);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    const payload = { content: "Something went wrong running that command.", ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

function scheduleDigest(discordClient) {
  const channelId = process.env.DIGEST_CHANNEL_ID;
  if (!channelId) {
    console.log("DIGEST_CHANNEL_ID not set — skipping scheduled price digest.");
    return;
  }

  const cronExpr = process.env.DIGEST_CRON || "0 * * * *";
  console.log(`Scheduling price digest with cron "${cronExpr}" -> channel ${channelId}`);

  cron.schedule(cronExpr, async () => {
    try {
      const channel = await discordClient.channels.fetch(channelId);
      const { prices } = await getTicker();

      const embed = new EmbedBuilder()
        .setTitle("QUVR Price Digest")
        .setURL("https://quvr.site")
        .setColor(0x22c55e)
        .setTimestamp(new Date());

      for (const p of prices) {
        const arrow = p.tone === "up" ? "🟢" : p.tone === "down" ? "🔴" : "⚪";
        const pct = p.changePct24h == null ? "n/a" : `${p.changePct24h.toFixed(2)}%`;
        embed.addFields({ name: `${arrow} ${p.symbol}`, value: `$${p.priceUsd} (${pct})`, inline: true });
      }

      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Failed to post price digest:", err);
    }
  });
}

client.login(process.env.DISCORD_TOKEN);
