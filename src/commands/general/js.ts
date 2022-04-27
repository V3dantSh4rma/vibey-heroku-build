import { Command, CommandCategories }                    from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction }                            from "discord.js";
import { Vibey }                                         from "../../handlers/client";

export default class JavascriptParser extends Command {
    public category: CommandCategories = "GENERAL";

    public dev = true;

    builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("js")
            .setDescription("Execute a javascript code.")
            .addStringOption(( a: SlashCommandStringOption )=>
                a
                    .setName("code")
                    .setDescription("The javascript code you want to execute.")
                    .setRequired(true)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            eval(interaction.options.getString("code") as string);
        } catch( e ) {
            await interaction.reply({ content: "There was an error in executing that command.", ephemeral: true });
            console.log(e);
            return;
        }
    }
}