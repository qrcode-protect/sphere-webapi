"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 17/05/2022 at 09:55
 * File src/Role/RoleType
 */

export enum RoleType {
    member = "MEMBER",
    partner = "PARTNER",
    user = "USER",
    admin = "ADMIN",
    marketing = "MARKETING",
}

export const roleLabel = (role: RoleType) => {
    switch (role) {
        case RoleType.admin:
            return "administrateur"
        case RoleType.marketing:
            return "marketing"
        case RoleType.member:
            return "adhérent"
        case RoleType.partner:
            return "partenaire"
        case RoleType.user:
            return "utilisateur"
    }
}

export enum RoleTypeLabel {
    member = "MEMBER",
    partner = "PARTNER",
    user = "USER",
    admin = "ADMIN",
    marketing = "MARKETING",
}
