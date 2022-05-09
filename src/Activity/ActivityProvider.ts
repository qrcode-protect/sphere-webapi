import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Activity                    from "QRCP/Sphere/Activity/Activity";

export default class ActivityProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("activity.model", () => new Activity())
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
