import { Command, CommandCategories } from "../../handlers/command";
import { SlashCommandBuilder }        from "@discordjs/builders";
import { CommandInteraction }         from "discord.js";
import { Vibey }                      from "../../handlers/client";
import axios, { AxiosResponse }       from "axios";

export default class Advice extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("advice")
            .setDescription("Get an advice from the bot.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const response: AxiosResponse<any> = await axios.get(process.env.ADVICE_URL as string);

            await interaction.reply(`${ response.data.slip.advice }`);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}