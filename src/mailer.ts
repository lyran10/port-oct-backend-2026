import nodemailer from 'nodemailer'

import { config } from './config.js'

const enabled = Boolean(config.SMTP_USER && config.SMTP_PASS)

const transport = enabled
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
    })
  : null

if (!enabled) console.log('Email alerts are off (SMTP_USER / SMTP_PASS not set).')

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

type NewMessage = { name: string; email: string; message: string }

// Emails you about a new contact message. "Reply" in your mail app goes straight to the sender.
export async function sendNewMessageAlert({ name, email, message }: NewMessage) {
  if (!transport) return
  await transport.sendMail({
    from: `"Portfolio" <${config.SMTP_USER}>`,
    to: config.NOTIFY_EMAIL || config.SMTP_USER,
    replyTo: { name, address: email },
    subject: `New message from ${name}`,
    text: `${name} <${email}> wrote:\n\n${message}`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote:</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  })
}
