import Application, { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Firebase                             from "App/Firebase";
import Config                               from "@ioc:Adonis/Core/Config";
import Log                                  from "@sofiakb/adonis-logger";
import path                                 from "path";

export default class AppProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("db", () => (new Firebase({
            projectId  : Config.get("firebase.projectId"),
            keyFilename: Config.get("firebase.keyFile"),
        })).db)
        this.app.container.singleton("logger", () => new Log(path.resolve(Application.appRoot, "storage/logs")))
    }

    public async boot() {
        // IoC container is ready
    }

    public async ready() {
        // App is ready
    }

    public async shutdown() {
        // Cleanup, since app is going down
    }
}
