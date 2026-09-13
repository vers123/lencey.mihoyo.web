/**
 * 邮箱格式校验
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 密码强度校验
 * 至少12位，包含大写字母、小写字母、数字、特殊符号
 */
export function validatePassword(password) {
  if (typeof password !== 'string') return { valid: false, message: '密码格式不正确' };
  if (password.length < 12) return { valid: false, message: '密码至少 12 个字符' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: '密码必须包含大写字母' };
  if (!/[a-z]/.test(password)) return { valid: false, message: '密码必须包含小写字母' };
  if (!/[0-9]/.test(password)) return { valid: false, message: '密码必须包含数字' };
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) return { valid: false, message: '密码必须包含特殊符号' };
  return { valid: true };
}

/**
 * 用户名校验
 * 3-20位，字母数字中文下划线
 */
export function validateUsername(username) {
  if (typeof username !== 'string') return { valid: false, message: '用户名格式不正确' };
  if (username.length < 3 || username.length > 20) return { valid: false, message: '用户名长度 3-20 位' };
  if (!/^[\w\u4e00-\u9fa5]+$/.test(username)) return { valid: false, message: '用户名只能包含字母、数字、下划线和中文' };
  return { valid: true };
}

/**
 * XSS 转义
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}
