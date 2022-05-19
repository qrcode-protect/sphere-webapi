"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:11
 * File src/Authentication/AuthProvider
 */


import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import ApiToken                from "QRCP/Sphere/Authentication/ApiToken/ApiToken";
import Jwt                     from "QRCP/Sphere/Authentication/Jwt";
import Config                  from "@ioc:Adonis/Core/Config";

export default class AuthProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
        this.app.container.singleton("auth.apiToken.model", () => new ApiToken())
        this.app.container.singleton("jwt", () => new Jwt(Config.get("jwt.secret")))
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
