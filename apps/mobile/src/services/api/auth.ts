/** Auth API — swap implementation when Supabase is connected. */
export interface AuthRepository {
  login(email: string, password: string): Promise<{ token: string }>;
  logout(): Promise<void>;
}

export class MockAuthRepository implements AuthRepository {
  async login(_email: string, _password: string) {
    return { token: 'mock_token_' + Date.now() };
  }
  async logout() {}
}

export const authRepository: AuthRepository = new MockAuthRepository();
