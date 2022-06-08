"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 14:06
 * File src/Authentication/utils/roles
 */

import { filter } from "lodash"

export enum RoleType {
    member = "MEMBER",
    partner = "PARTNER",
    user = "USER",
    admin = "ADMIN",
    marketing = "MARKETING",
}

interface RoleAttributes {
    name: string
    label: string
    level: number
}

export class Role {
    name: string
    label: string
    level: number

    constructor(attributes: RoleAttributes) {
        this.name = attributes.name
        this.label = attributes.label
        this.level = attributes.level
    }
}

export const roles = [
    new Role({ name: RoleType.admin, label: "administrateur", level: 0 }),
    new Role({ name: RoleType.marketing, label: "marketing", level: 100 }),
    new Role({ name: RoleType.partner, label: "partenaire", level: 200 }),
    new Role({ name: RoleType.member, label: "adhérent", level: 300 }),
    new Role({ name: RoleType.user, label: "utilisateur", level: 400 }),
]

export const retrieveRole = (roleType: RoleType): Role => filter(roles, role => role.name === roleType)[0] ?? null

export const rolesByLevel = (reason?: string) => {
    switch (reason?.toLowerCase()) {
        case "dashboard": {
            return filter(roles, (role) => role.level < 200)
        }
        case "partner": {
            return filter(roles, (role) => role.level === retrieveRole(RoleType.partner).level)
        }
        default: {
            const role = filter(roles, (roleItem) => roleItem.name === reason)[0] ?? null
            return role ? filter(roles, (roleItem) => roleItem.level <= role.level) : roles
        }
    }
}
