import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";
import axios, { AxiosResponse }             from "axios";


export default class Chucknorris extends Command {
    public category: CommandCategories = "FUN";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("chucknorris")
            .setDescription("Generate a Chuck Norris themed joke.");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.CHUCK_NORISS_API as string);

            const embed: MessageEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(res.data.value as string)
                .setThumbnail(res.data.icon_url);


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