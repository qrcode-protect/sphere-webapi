import Application, { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Firebase                             from "App/Firebase";
import Config                               from "@ioc:Adonis/Core/Config";
import Log                                  from "@sofiakb/adonis-logger";
import path                                 from "path";
import { Bucket, Storage }                  from "@google-cloud/storage";
import { Auth }                             from "firebase-admin/auth";
import { Auth as firebaseAuth }             from "firebase/auth";
import firebase                                   from "firebase/compat/app";

export default class AppProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings

        const firebase = (new Firebase({
            projectId  : Config.get("firebase.projectId"),
            keyFilename: Config.get("firebase.keyFile"),
        }))

        this.app.container.singleton("db", () => firebase.db)
        this.app.container.singleton("firebase.storage", (): Storage => firebase.storage)
        this.app.container.singleton("firebase.storage", (): Bucket => firebase.storageBucket)
        this.app.container.singleton("firebase.auth", (): Auth => firebase.auth)
        this.app.container.singleton("firebase.clientAuth", (): firebaseAuth => firebase.clientAuth)

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
