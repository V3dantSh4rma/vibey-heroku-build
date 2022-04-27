import { Command, CommandCategories } from "../../handlers/command";
import { SlashCommandBuilder }        from "@discordjs/builders";
import { CommandInteraction }         from "discord.js";
import { Vibey }                      from "../../handlers/client";
import axios, { AxiosResponse }       from "axios";


export default class Fact extends Command {
    public category: CommandCategories = "FUN";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("fact")
            .setDescription("Generate a weird yet interesting fact.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.FACT_API as string);

            await interaction.reply(res.data.fact);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}