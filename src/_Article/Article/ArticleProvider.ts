import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Article                 from "QRCP/Sphere/_Article/Article/Article";

export default class ArticleProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("article.model", () => new Article())
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
