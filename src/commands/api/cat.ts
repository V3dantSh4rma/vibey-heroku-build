import { Command, CommandCategories }       from "../../handlers/command";
import { SlashCommandBuilder }              from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Vibey }                            from "../../handlers/client";
import axios, { AxiosResponse }             from "axios";


export default class Cat extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("cat")
            .setDescription("Receive a random cat picture from the internet. 🐹");
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.CAT_API as string);

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle(":cat:")
                .setImage(`https://cataas.com/${ res.data.url }`)
                .setTimestamp()
                .setColor("RANDOM");

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