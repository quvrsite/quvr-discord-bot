import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { listChains } from "../quvrApi.js";

export const data = new SlashCommandBuilder()
  .setName("chains")
  .setDescription("List bridge source chains available on QUVR for Robinhood Chain");

export async function execute(interaction) {
  await interaction.deferReply();
  try {
    const { chains } = await listChains();
    const embed = new EmbedBuilder()
      .setTitle("QUVR Bridge Source Chains → Robinhood Chain (4663)")
      .setURL("https://quvr.site/bridge")
      .setColor(0xf59e0b)
      .setDescription(
        chains.map((c) => `**${c.name}** (id ${c.id}) — ${c.explorer_url}`).join("\n"),
      );
    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to fetch chains: ${err.message}`);
  }
}
