import { Command, CommandCategories }                          from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption }         from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, Role } from "discord.js";
import { Vibey }                                               from "../../handlers/client";
import moment                                                  from "moment";

export default class Userinfo extends Command {
    public category: CommandCategories = "INFORMATION";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("userinfo")
            .setDescription("Get your or someone other's account information.")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to get info of.")
                    .setRequired(false)
            );
    };

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        try {
            const user: ( GuildMember | undefined ) = interaction.guild?.members.cache.get(interaction.options.getUser("user")?.id as string ?? interaction.user.id as string);
            const createdAt: string                 = moment(interaction.options.getUser("user")?.createdAt ?? interaction.user.createdAt).format("MMMM Do YYYY");
            const joinedAt: string                  = moment(user?.joinedAt).format("MMMM Do YYYY");

            const roles: any = user?.roles.cache
                .sort(( a: Role, b: Role )=>b.position - a.position)
                .map(( role: Role )=>role.toString())
                .slice(0, -1);

            const embed: MessageEmbed = new MessageEmbed()
                .setTitle(`${ user?.displayName }'s Account Information`)
                .setColor("RANDOM")
                .addFields(
                    {
                        name  : "> Username",
                        value : `${ user?.user.username }#${ user?.user.discriminator }`,
                        inline: false
                    },
                    {
                        name  : "> Id",
                        value : `${ user!.id }`,
                        inline: false
                    },
                    {
                        name  : "> Nickname",
                        value : `${ user?.nickname ?? "No Nickname" }`,
                        inline: false
                    },
                    {
                        name  : `> Roles [ ${ roles?.length ?? "0" } ]`,
                        value : `${ roles?.join(", ") || "No roles." }`,
                        inline: false
                    },
                    {
                        name  : "> Created at",
                        value : `_${ createdAt }_`,
                        inline: false
                    },
                    {
                        name  : "> Joined at",
                        value : `_${ joinedAt }_`,
                        inline: false
                    }
                );

            await interaction.reply({ embeds: [ embed ] });
        } catch( e ) {
            console.log(e);
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}