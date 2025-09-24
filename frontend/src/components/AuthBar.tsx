import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthBar() {
  const { user, loading, login, register, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"success" | "error" | "">("");

  const withNotice = async (
    fn: () => Promise<void>,
    { ok, fail }: { ok: string; fail: string }
  ) => {
    setSubmitting(true);
    setMsg("");
    setMsgType("");
    try {
      await fn();
      setMsg(ok);
      setMsgType("success");
    } catch (e: any) {
      const detail = e?.response?.data?.detail || e?.message || "";
      setMsg(detail ? `${fail}：${detail}` : fail);
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="empty">鉴权加载中...</div>;

  if (!user) {
    return (
      <div className="form" style={{ marginBottom: 8 }}>
        <input
          className="input"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="button"
          disabled={submitting}
          onClick={() =>
            withNotice(() => login(username, password), {
              ok: "登录成功",
              fail: "登录失败",
            })
          }
        >
          登录
        </button>
        <button
          className="button"
          disabled={submitting}
          onClick={() =>
            withNotice(() => register(username, password), {
              ok: "注册成功，请登录",
              fail: "注册失败",
            })
          }
        >
          注册
        </button>
        {msg && <div className={`notice ${msgType}`}>{msg}</div>}
      </div>
    );
  }

  return (
    <div className="toolbar">
      <div>
        当前用户：{user.username}（{user.role}）
      </div>
      <div className="actions">
        <button
          className="button"
          onClick={() => {
            logout();
            setMsg("");
            setMsgType("");
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
