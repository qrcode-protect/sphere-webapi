"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 10:10
 * File src/Product/ProductMail
 */

import Mail    from "QRCP/Sphere/Mail/Mail";
import Partner from "QRCP/Sphere/Partner/Partner";

export default class ProductMail extends Mail {
    /**
     * @return bool
     * @param partner
     */
    public static async product(partner: Partner) {
        return super.text(partner.email, "Nouveau message depuis reseau-sphere.com", "Vos produits ont bien été ajoutés.")
    }

    /**
     * @return bool
     * @param partner
     */
    public static async failed(partner: Partner) {
        return super.text(partner.email, "Nouveau message depuis reseau-sphere.com", "Une erreur est survenue lors de l'ajout des produits.")
    }
}
