import { CommandInteraction }         from "discord.js";
import { Vibey }                      from "../../handlers/client";
import { Command, CommandCategories } from "../../handlers/command";
import { SlashCommandBuilder }        from "@discordjs/builders";


export default class Ping extends Command {

    public category: CommandCategories = "GENERAL";

    builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Pong!");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        await interaction.reply(`Pong! ${ client.ws.ping }ms.`);
    }

}