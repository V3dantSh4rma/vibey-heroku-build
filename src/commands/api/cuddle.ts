import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User }      from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class Cuddle extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("cuddle")
            .setDescription("Cuddle you loved ones.")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to cuddle.")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.CUDDLE_API as string);
            const user: ( User | null )   = interaction.options.getUser("user");
            const embed: MessageEmbed     = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp();

            if( user ) {
                embed
                    .setImage(res.data.url)
                    .setTitle(`${ interaction.user.username } cuddles ${ user.username } (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`);

                await interaction.reply({ embeds: [ embed ] });
            }

            embed
                .setImage(res.data.url as string)
                .setTitle(`I cuddle you. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`);
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