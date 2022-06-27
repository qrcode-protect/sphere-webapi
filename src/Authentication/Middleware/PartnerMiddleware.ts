import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { RoleType }                 from "QRCP/Sphere/Authentication/utils/roles";
import { validateRole }             from "./utils";

export default class AuthMiddleware {


    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
        return validateRole(RoleType.partner, request, response, next)
    }
}
