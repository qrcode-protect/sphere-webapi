"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/ArticleParagraph/ArticleParagraph
 */

import Service                    from "QRCP/Sphere/Common/Service";
import ArticleParagraphAttributes from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraphAttributes";
import ArticleParagraph           from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraph";

export default class ArticleParagraphService extends Service {

    constructor(model = ArticleParagraph) {
        super(model);
    }

    public store = async (data: ArticleParagraphAttributes) => super.store(data)

}
