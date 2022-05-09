"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:36
 * File src/Common/Log
 */

import SofiakbLog  from "@sofiakb/adonis-logger"
import Application from "@ioc:Adonis/Core/Application";
// import { currentUser } from "App/Common/auth";

export default class Log extends SofiakbLog {
    public static write(level, data, channel: string | null = null) {
        if (Application.container.hasBinding("http.context")) {
            const ctx = Application.container.use("http.context")
            const user = { email: "test" }// currentUser()
            Application.container.use("logger").write(level, `\n\t* URL : ${ctx.request.completeUrl()}\n\t* Adresse IP : ${ctx.request.ip()}\n\t* Message : ${data}${user ? "\n\t* Utilisateur : " + user.email : ""}`, channel)
        } else {
            Application.container.use("logger").write(level, data, channel)
        }
    }

    /**
     * @param message
     * @param exception
     * @param channel
     * @return bool
     */
    public static error = (message, exception = false, channel = "errors") => {
        if (message instanceof Error || exception) {
            message = message.message + "\n" + message.stack;
        }
        return Log.write("error", message, channel);
    };

    /**
     * @param message
     * @param channel
     * @return bool
     */
    public static info = (message, channel = "info") => Log.write("info", message, channel);

    /**
     * @param message
     * @param channel
     * @return bool
     */
    public static debug = (message, channel = "debug") => Log.write("debug", message, channel);

    /**
     * @param message
     * @param channel
     * @return bool
     */
    public static success = (message, channel = "info") => Log.write("success", message, channel);

    /**
     * @param message
     * @param channel
     * @return bool
     */
    public static warning = (message, channel = "info") => Log.write("warning", message, channel);
}
