import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";

export default class SourceCode extends Command {
    public category: CommandCategories = "GENERAL";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("source_code")
            .setDescription("Get the Bot's source code.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        try {
            const embed: MessageEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(`[Click to reveal](https://github.com/V3dantSh4rma/Octal-v2)`)
                .setTitle(`${ client?.user?.username }'s Source Code`);

            await interaction.reply({ embeds: [ embed ] });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}