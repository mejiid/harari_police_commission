import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const COMMISSION_EMAIL = process.env.COMMISSION_EMAIL!;
