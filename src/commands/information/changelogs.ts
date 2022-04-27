import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";

export default class Changelogs extends Command {
    public category: CommandCategories = "INFORMATION";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("changelogs")
            .setDescription("Get the bot's changelogs");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {

        try {
            const embed: MessageEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${ client!.user!.username }'s Changelogs`)
                .setDescription(`A Short note from the Developer\n\`\`\`"I have added some new commands. If you ever find the bugs. Make sure to report them using /report slash command. Or, if you have enough skills to fix the bug... Make sure to contribute to the bugged command on it's source code page."\`\`\``)
                .addFields(
                    { name: "> Commands Added",
                        value: `\`\`\`- /delete\n- /trash\n- /play\n- /pause\n- /kick\`\`\``,
                        inline: false
                    },
                    { name: "> Commands Removed", value: `\`\`\`- /youtube_info\`\`\``, inline: false },
                    { name: "> Bugged Commands", value: `\`\`\`- /crypto\`\`\`` }
                );

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