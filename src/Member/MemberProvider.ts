import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Member                    from "QRCP/Sphere/Member/Member";

export default class MemberProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("member.model", () => new Member())
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
