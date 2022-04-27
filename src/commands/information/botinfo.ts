import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";

export default class Botinfo extends Command {
    public category: CommandCategories = "INFORMATION";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("botinfo")
            .setDescription("Get the bot info.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        try {
            const guildId = client.guilds.cache.get("780433753762955314");

            const tsEmoji      = guildId?.emojis.cache.find(emoji=>emoji.name === "typescript");
            //format - `<:${tsEmoji?.name}:${tsEmoji?.id}>`
            const discordEmoji = guildId?.emojis.cache.find(emoji=>emoji.name === "discord");
            const owner        = client.users.cache.get("554301512227094528");

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle(`${ client?.user?.username }'s Information`)
                .setTimestamp()
                .setColor("RANDOM")
                .addFields(
                    { name: "> Client Username", value: `${ client.user?.username }`, inline: false },
                    { name: "> Language used",
                        value: `<:${ tsEmoji?.name }:${ tsEmoji?.id }> Typescript`,
                        inline: false
                    },
                    {
                        name  : "> Library used",
                        value : `<:${ discordEmoji?.name }:${ discordEmoji?.id }> Discord.js`,
                        inline: false
                    },
                    {
                        name  : "> Bot Owner",
                        value : `${ owner?.username }#${ owner?.discriminator } (id: ${ owner?.id }`,
                        inline: false
                    },
                    { name: "> Contributors", value: `ItsMrSammeh#0001 (id: 172033311592415232)`, inline: false },
                    {
                        name  : "> Source Code",
                        value : `[Click to reveal](https://github.com/V3dantSh4rma/Octal-v2)`,
                        inline: false
                    }
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