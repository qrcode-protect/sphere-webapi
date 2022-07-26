"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 10:10
 * File src/Request/RequestMail
 */

import Mail                      from "QRCP/Sphere/Mail/Mail";
import Request                   from "QRCP/Sphere/Request/Request";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import Quote                     from "QRCP/Sphere/Quote/Quote";

export default class RequestMail extends Mail {
    /**
     * @return bool
     * @param request
     * @param quotation
     * @param file
     */
    public static async sendQuotation(request: Request, quotation: Quote, file: Nullable<MultipartFileContract>) {
        return super.text(request.member.email, "Nouveau message depuis reseau-sphere.com", `Votre demande #${request.id} a fait l'objet d'une réponse de la part du fournisseur. \n\n${quotation.toString()}`, file)
    }


    /**
     * @return bool
     * @param request
     */
    public static async declined(request: Request) {
        return super.text(request.member.email, "Nouveau message depuis reseau-sphere.com", `Votre demande #${request.id} a été refusée par le fournisseur.`)
    }

    /**
     * @return bool
     * @param request
     * @param file
     */
    public static async quotationSent(request: Request, file: Nullable<MultipartFileContract>) {
        return super.text(request.partner.email, "Nouveau message depuis reseau-sphere.com", `Votre devis a bien été transmis à ${request.member.email}.`, file)
    }
}
