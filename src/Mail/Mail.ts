"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 17:11
 * File src/Mail/Mail
 */

import Application               from "@ioc:Adonis/Core/Application";
import MailAddons                from "@ioc:Adonis/Addons/Mail";
import User                      from "QRCP/Sphere/User/User";
import { retrieveRole }          from "QRCP/Sphere/Authentication/utils/roles";
import { capitalize, each }      from "lodash";
import mailConfig                from "Config/mail";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import Drive                     from "@ioc:Adonis/Core/Drive";

export default class Mail {

    static async send(to: string, subject: string, view: string, data: any) {
        await MailAddons.send((message) => {
            message.embed(
                Application.publicPath("img/logo.png"),
                "mail-app-logo",
            )
            message.embed(
                Application.publicPath("img/email.png"),
                "mail-envelope-icon",
            )

            message
                .from(mailConfig.mailers.smtp.auth?.user ?? "noreply@reseau-sphere.com", "SPHÈRE")
                .to(to)
                .subject(subject)
                .htmlView(`emails/${view}`, data)
        })
    }

    static async text(to: string | string[], subject: string, content: string, file?: Nullable<MultipartFileContract>) {
        await MailAddons.send((message) => {

            if (Array.isArray(to)) {
                each(to, recipient => message.to(recipient))
            } else message.to(to)

            if (file && (file.tmpPath || file.filePath)) {
                const filePath = file.filePath && Drive.exists(file.filePath) ? file.filePath : file.tmpPath
                if (filePath)
                    message.attach(filePath, { filename: file.clientName, contentType: file.headers["content-type"] })
            }

            message
                .from(mailConfig.mailers.smtp.auth?.user ?? "noreply@reseau-sphere.com", "SPHÈRE")
                .subject(subject)
                .text(`${content} \n\nCordialement, L'équipe SPHÈRE`)
        })
    }

    static async registerMember(user: User, link: string | null) {
        await Mail.send(user.email, "Bienvenue chez SPHÈRE !", "member/welcome", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Bienvenue chez SPHÈRE !", "member/welcome", {
            user: { fullName: `${capitalize(user.firstname)} ${capitalize(user.lastname)}` },
            url : link,
        })
    }

    static async registerPartner(user: User, link: string | null) {
        await Mail.send(user.email, "Bienvenue chez SPHÈRE !", "partner/welcome", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Bienvenue chez SPHÈRE !", "partner/welcome", {
            user: { fullName: `${capitalize(user.firstname)} ${capitalize(user.lastname)}` },
            url : link,
        })
    }

    static async registerDashboard(user: User, link: string) {

        await Mail.send(user.email, "Votre accès au dashboard SPHÈRE a été créé", "dashboard/welcome", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Votre accès au dashboard SPHÈRE a été créé", "dashboard/welcome", {
            user: { fullName: `${capitalize(user.firstname)}` },
            url : link,
            role: retrieveRole(user.roleType)
        })
    }

    static async forgotPasswordMember(user: User, link: string | null) {
        await Mail.send(user.email, "Réinitialisation de votre mot de passe SPHÈRE !", "member/auth/password/forgot", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Réinitialisation de votre mot de passe SPHÈRE !", "member/auth/password/forgot", {
            user: { fullName: `${capitalize(user.firstname)}` },
            url : link,
        })
    }

    static async forgotPasswordPartner(user: User, link: string | null) {
        await Mail.send(user.email, "Réinitialisation de votre mot de passe SPHÈRE !", "partner/auth/password/forgot", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Réinitialisation de votre mot de passe SPHÈRE !", "partner/auth/password/forgot", {
            user: { fullName: `${capitalize(user.firstname)}` },
            url : link,
        })
    }

    static async forgotPasswordDashUser(user: User, link: string) {

        await Mail.send(user.email, "Réinitialisation de votre mot de passe dashboard SPHÈRE", "dashboard/auth/password/forgot", {
            // await Mail.send("sofiane.akbly@qrcode-protect.com", "Réinitialisation de votre mot de passe dashboard SPHÈRE", "dashboard/auth/password/forgot", {
            user: { fullName: `${capitalize(user.firstname)}` },
            url : link,
            role: retrieveRole(user.roleType)
        })
    }

}
