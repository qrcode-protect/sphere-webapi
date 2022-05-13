import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import User                    from "QRCP/Sphere/User/User";

export default class UserProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("user.model", () => new User())
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
