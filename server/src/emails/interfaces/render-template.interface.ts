import {SendMail} from "@libs/interfaces/mailer";

export type RenderTemplateInterface= Pick<SendMail, "template" | "variables">