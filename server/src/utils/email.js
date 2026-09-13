import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
  return transporter;
}

/**
 * 发送邮件
 */
export async function sendEmail({ to, subject, html }) {
  if (!config.smtp.user || !config.smtp.pass) {
    console.warn('[Email] SMTP 未配置，跳过发送。邮件内容：', subject);
    return false;
  }

  try {
    const info = await getTransporter().sendMail({
      from: config.smtp.from || config.smtp.user,
      to,
      subject,
      html,
    });
    console.log(`[Email] 邮件已发送: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('[Email] 发送失败:', err.message);
    return false;
  }
}

/**
 * 发送邮箱验证邮件
 */
export async function sendVerificationEmail(to, username, verifyUrl) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>邮箱验证</h2>
      <p>您好 ${username}，</p>
      <p>感谢您注册 Vers123 游戏导航站！请点击下面的按钮验证您的邮箱：</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #4A90E2; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">验证邮箱</a>
      <p>或者复制链接到浏览器打开：</p>
      <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
      <p>如果您没有注册过本站，请忽略此邮件。</p>
      <hr/>
      <p style="color: #999; font-size: 12px;">Vers123 游戏导航站</p>
    </div>
  `;
  return sendEmail({ to, subject: '【Vers123】请验证您的邮箱', html });
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(to, resetUrl) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>密码重置</h2>
      <p>您好，</p>
      <p>我们收到了您的密码重置请求。请点击下面的按钮重置密码：</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #e74c3c; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">重置密码</a>
      <p>或者复制链接到浏览器打开：</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>此链接 30 分钟内有效。如果您没有请求重置密码，请忽略此邮件。</p>
      <hr/>
      <p style="color: #999; font-size: 12px;">Vers123 游戏导航站</p>
    </div>
  `;
  return sendEmail({ to, subject: '【Vers123】密码重置', html });
}
