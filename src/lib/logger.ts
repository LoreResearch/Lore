const ts = () => new Date().toISOString().slice(0, 19).replace("T", " ");
export const log = {
  info: (...a: unknown[]) => console.log(`[${ts()}] INFO  `, ...a),
  warn: (...a: unknown[]) => console.warn(`[${ts()}] WARN  `, ...a),
  error: (...a: unknown[]) => console.error(`[${ts()}] ERROR `, ...a),
};
