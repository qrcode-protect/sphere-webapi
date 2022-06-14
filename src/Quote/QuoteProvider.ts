import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Partner                    from "QRCP/Sphere/Partner/Partner";

export default class QuoteProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("partner.model", () => new Partner())
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
