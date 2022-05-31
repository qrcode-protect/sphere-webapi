"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Article/ArticleAttributes
 */

import ArticleParagraph from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraph";

export default interface ArticleAttributes {
    id: string,
    writer: string,
    image: string,
    themes: string[],
    title: string,
    paragraphs?: ArticleParagraph[],
    networks: string[] | null,
}
