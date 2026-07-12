import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { searchTokens } from "../quvrApi.js";

export const data = new SlashCommandBuilder()
  .setName("tokens")
  .setDescription("Search QUVR stock tokens / assets")
  .addStringOption((opt) =>
    opt.setName("query").setDescription("Symbol to search for").setRequired(false),
  );

export async function execute(interaction) {
  await interaction.deferReply();
  try {
    const query = interaction.options.getString("query") || "";
    const { tokens } = await searchTokens(query);

    if (tokens.length === 0) {
      await interaction.editReply("No matching tokens found.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`QUVR Tokens${query ? ` matching "${query}"` : ""}`)
      .setURL("https://quvr.site")
      .setColor(0x3b82f6)
      .setDescription(
        tokens
          .slice(0, 20)
          .map(
            (t) =>
              `**${t.symbol}** — ${t.name} (${t.category})${
                t.cached_price_usd != null ? ` — $${t.cached_price_usd}` : ""
              }`,
          )
          .join("\n"),
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to search tokens: ${err.message}`);
  }
}
