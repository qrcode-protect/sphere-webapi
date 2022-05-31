"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/ArticleParagraph/ArticleParagraph
 */

import ArticleParagraphAttributes from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraphAttributes";
import Model                      from "QRCP/Sphere/Common/Model";

export default class ArticleParagraph extends Model {
    id: string
    title: string
    content: string

    constructor(attributes?: ArticleParagraphAttributes) {
        super({ collectionName: "article_paragraphs", model: ArticleParagraph });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }
}
