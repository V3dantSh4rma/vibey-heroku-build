import { CommandInteraction }         from "discord.js";
import { Vibey }                      from "../../handlers/client";
import { Command, CommandCategories } from "../../handlers/command";
import { SlashCommandBuilder }        from "@discordjs/builders";


export default class Hello extends Command {

    public category: CommandCategories = "GENERAL";

    builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("test")
            .setDescription("Just a test command to see if the bot works.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        await interaction.reply("test");
    }

}
