import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Network                 from "QRCP/Sphere/_Network/Network/Network";

export default class NetworkProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("network.model", () => new Network())
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
