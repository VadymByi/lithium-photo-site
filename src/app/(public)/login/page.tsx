export default function LoginPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1></h1>
      <form action="/api/auth/callback/credentials" method="POST">
        <input
          name="username"
          placeholder="Username"
          required
          style={{ display: 'block', margin: '10px auto' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ display: 'block', margin: '10px auto' }}
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
