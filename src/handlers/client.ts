import { CacheType, Client, Collection, Intents, Interaction } from "discord.js";
import * as path                                               from "path";
import { FileLoader }                                          from "../utility/file-loader";
import { Command }                                             from "./command";
import { REST }                                                from "@discordjs/rest";
import { Routes }                                              from "discord-api-types/v9";
import { AudioResource }                                       from "@discordjs/voice";

const intents: Intents = new Intents(32767);

interface queueStructure {
    guildId: string,
    song: string,
    nowPlaying: string,
    songs: [],
    resource: AudioResource
};

export class Vibey extends Client {
    commands: Collection<string, Command>;
    _rest: REST = new REST({ version: "9" }).setToken(process.env.TOKEN as string);

    constructor() {
        super({ intents });
        this.commands = new Collection<string, Command>();
    }

    public async startClient(): Promise<void> {
        await this.login(process.env.TOKEN as string);
        await this.loadCommandHandlers();
        await this.addCommandsToServer();
        await this.registerEventListeners();
        console.log("Bot is online.");
        console.log(`Serving ${ this.users.cache.size } users.`);
        console.log(`Serving in ${ this.guilds.cache.size } servers.`);
    }

    private async addCommandsToServer() {

        const commandsArray: any[] = [];
        for( let command of this.commands.values() ) {
            commandsArray.push(command.builderJson);
        }

        await this._rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: commandsArray }
        );


        console.log(`Registered the Slash Commands (${ commandsArray.map(c=>"/" + c.name).join(", ") }).`);
    }

    private async loadCommandHandlers() {
        const modules = await FileLoader.importModulesFrom<Command>(path.join(__dirname, "..", "commands", "**", "*{.js,.ts}"));

        for( let commandModule of modules ) {
            const command            = new commandModule.instance();
            const commandBuilderJson = command.builderJson;

            this.commands.set(commandBuilderJson.name, command);
        }
    }

    private async registerEventListeners() {
        this.on("interactionCreate", async( interaction: Interaction<CacheType> )=>{
            if( interaction.user.bot ) return;

            if( !interaction.isCommand() ) return;

            const command: ( Command | undefined ) = this.commands.get(interaction.commandName);

            try {

                if( command?.dev === true ) {
                    if( interaction.user.id === "554301512227094528" ) {
                        return command?.handle(interaction, this);
                    }

                    return await interaction.reply({ content: "This command is Developer only.", ephemeral: true });
                }

                command?.handle(interaction, this);

            } catch( e ) {
                await interaction.reply({
                    content  : "There was an error in executing that Command.",
                    ephemeral: true
                });
                console.error(e);
                return;
            }

        });
    }
}