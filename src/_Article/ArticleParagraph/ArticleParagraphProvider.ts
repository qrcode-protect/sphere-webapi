import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import ArticleParagraph        from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraph";

export default class ArticleParagraphProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("article.model", () => new ArticleParagraph())
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
