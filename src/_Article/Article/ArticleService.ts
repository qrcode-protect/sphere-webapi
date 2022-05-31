"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Article/Article
 */

import Service           from "QRCP/Sphere/Common/Service";
import ArticleAttributes from "QRCP/Sphere/_Article/Article/ArticleAttributes";
import Article           from "QRCP/Sphere/_Article/Article/Article";
import { Result, Success, Error as SofiakbError }        from "@sofiakb/adonis-response";
import Log               from "QRCP/Sphere/Common/Log";

export default class ArticleService extends Service {

    constructor(model = Article) {
        super(model);
    }

    public store = async (data: ArticleAttributes) => super.store(data)

    public async findByNetworkId(networkId?: string): Promise<Success | SofiakbError> {
        try {
            const data = await this.model.findByNetworkId(networkId) ?? []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
