"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 18/05/2022 at 14:39
 * File app/Common/auth
 */

import { RequestContract }          from "@ioc:Adonis/Core/Request";
import Application                  from "@ioc:Adonis/Core/Application";
import { apiTokenModel, userModel } from "App/Common/model";
import User                         from "QRCP/Sphere/User/User";
import ApiToken                     from "QRCP/Sphere/Authentication/ApiToken/ApiToken";

export const bearerToken = (request: RequestContract): string | null => {
    const bearerHeader = request.header("Authorization")
    return bearerHeader?.replace("Bearer ", "").replace("bearer", "") ?? null
}

export const authCustomToken = (request: RequestContract): string | null => {
    const authCustomToken = request.header("X-AUTH-TOKEN")
    return authCustomToken?.replace("Bearer ", "").replace("bearer", "") ?? null
}

export const currentApiToken = async (bearerToken?: string | null): Promise<ApiToken | null> => {
    if (Application.container.hasBinding("current.apiToken")) {
        return <ApiToken>Application.container.use("current.apiToken")
    }

    if (bearerToken && bearerToken.trim() !== "") {
        return await apiTokenModel().findOneBy("token", bearerToken)
    }

    return null
}

export const currentUser = async (bearerToken?: string | null): Promise<User | null> => {
    if (Application.container.hasBinding("current.user")) {
        return <User>Application.container.use("current.user")
    }

    if (bearerToken && bearerToken.trim() !== "") {

        const apiToken: ApiToken | null = await currentApiToken(bearerToken)

        if (apiToken === null)
            return null

        return await userModel().findOneBy("id", apiToken.userId)
    }

    return null
}
