import * as cc from "@shah/ts-content-classification";
import * as atc from "./html-anchor-text-classification";

// "side effect" rules find anchor texts that might cause damage like unsubscribing to a email periodical
export const commonSideEffectRules: atc.AnchorTextClassificationRule<any>[] = [
    atc.sideEffectRule(cc.exactMatchOneOf(
        "unsubscribe",
        "update email preferences",
        "update your preferences",
        "update profile",
        "manage your subscriptions",
        "manage preferences",
        "personalize",
        "update subscription preferences")),
    atc.sideEffectRule(cc.regExpMatch(/subscribe/)),
    atc.sideEffectRule(cc.regExpMatch(/^i no longer wish to receive .*? emails$/)),
];

// General Email Regex (RFC 5322 Official Standard) - from https://emailregex.com/
const emailAddressRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const commonRules: atc.AnchorTextClassificationRule<any>[] = [
    atc.blankTextRule(),
    ...commonSideEffectRules,
    atc.nonContentRule(cc.startsWith("mailto:"), { modifiers: ["mail-to"] }),
    atc.nonContentRule(cc.exactMatchOneOf(
        "contact us",
        "email me",
        "why did i get this?",
        "add us to your address book",
        "media kit",
        "try email marketing for free today!",
        "advertise"), { modifiers: ["promotion"] }),
    atc.nonContentRule(cc.exactMatchOneOf(
        "disclosures",
        "privacy policy"), { modifiers: ["legal"] }),
    atc.nonContentRule(cc.exactMatchOneOf(
        "view this email in your browser",
        "view in browser",
        "view web version"), { modifiers: ["read-in-browser"] }),
    atc.nonContentRule(cc.regExpMatch(/^@[a-z0-9_]+$/), { modifiers: ["twitter-handle"] }),
    atc.nonContentRule(cc.regExpMatch(emailAddressRegExp), { modifiers: ["email-address"] }),
    atc.contentRule(cc.startsWith("ebook: "), { modifiers: ["ebook"] }),
    atc.contentRule(cc.startsWith("whitepaper: "), { modifiers: ["whitepaper"] }),
];
