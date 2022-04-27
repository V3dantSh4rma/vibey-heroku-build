import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User }      from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class Hug extends Command {
    public category: CommandCategories = "API";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("poke")
            .setDescription("Poke the dearest ones you know")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to hug")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {
        const user: ( User | null ) = interaction.options.getUser("user");
        const embed: MessageEmbed   = new MessageEmbed()
            .setTimestamp()
            .setColor("RANDOM");

        try {
            const res: AxiosResponse<any> = await axios.get<string>(process.env.POKE_API as string);

            if( !user ) {
                embed
                    .setImage(res.data.url as string)
                    .setTitle("I poke you");

                await interaction.reply({ embeds: [ embed ] });
                return;
            }

            embed
                .setTitle(`${ interaction.user.username } pokes ${ user?.username }!`)
                .setImage(res.data.url as string);


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