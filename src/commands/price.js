import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getTicker } from "../quvrApi.js";

export const data = new SlashCommandBuilder()
  .setName("price")
  .setDescription("Show live QUVR prices for stock tokens & USDG")
  .addStringOption((opt) =>
    opt
      .setName("symbol")
      .setDescription("Filter by symbol, e.g. TSLA (leave empty for all)")
      .setRequired(false),
  );

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const { prices } = await getTicker();
    const symbol = interaction.options.getString("symbol")?.toUpperCase();
    const rows = symbol
      ? prices.filter((p) => p.symbol.toUpperCase() === symbol)
      : prices;

    if (rows.length === 0) {
      await interaction.editReply(
        symbol ? `No ticker data for **${symbol}**.` : "No ticker data available.",
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("QUVR Live Prices")
      .setURL("https://quvr.site")
      .setColor(0x22c55e)
      .setFooter({ text: "Data via quvr.site — Robinhood Chain" })
      .setTimestamp(new Date());

    for (const p of rows) {
      const arrow = p.tone === "up" ? "🟢" : p.tone === "down" ? "🔴" : "⚪";
      const pct =
        p.changePct24h == null ? "n/a" : `${p.changePct24h.toFixed(2)}%`;
      const badge = p.badge ? `\n_${p.badge}_` : "";
      embed.addFields({
        name: `${arrow} ${p.symbol}`,
        value: `$${p.priceUsd}  (${pct})${badge}`,
        inline: true,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to fetch QUVR prices: ${err.message}`);
  }
}
