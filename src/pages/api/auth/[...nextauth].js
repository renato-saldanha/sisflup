import CredentialsProvider from "next-auth/providers/credentials";

import { config } from "../../../uteis/config";
import { path } from "../../../uteis/constPath";
import NextAuth from "next-auth/next";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // O nome a ser exibido no formulário de login (por exemplo, "Entrar com...")
      name: "Credentials",
      type: "credentials",
      // `Credentials` é usado para gerar um formulário na página de login.
      // Você pode especificar quais campos devem ser enviados, adicionando chaves ao objeto `Credentials`.
      // por exemplo. domínio, nome de usuário, senha, token 2FA, etc.
      // Você pode passar qualquer atributo HTML para a tag <input> através do objeto.
      // credentials: {},
      async authorize(credentials, req) {
        // Adicione lógica aqui para procurar o usuário a partir das credenciais fornecidas
        const res = await fetch(`${config.server}/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const usuarioData = await res.json();

        if (res.status === 200) {
          // console.log("Dados:", usuarioData.usuario)
          const user = usuarioData.usuario;
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // "user" parâmetro é o objeto recebido de"authorize"
      // "token" está sendo enviado abaixo para "session" callback...
      // .. se definimos o parâmetro "user" de "token" para objeto de "autorizar" ...
      // .. e devolva..
      // console.log("jwt callback",user)

      user && (token.user = user);
      return token;
    },

    async session({ session, token, user }) {
      // console.log("session callback")
      // params.session.user = params.token.usuario

      // console.log("usuario:", token);
      const newSession = {
        ...session,
        user: token.user,
        accessToken: token.accessToken
      };
      // console.log("newSession:", newSession);
      return newSession;
    },
  },
  pages: {
    signIn: path.atividadesGerais,
    signOut: path.login,
    error: path.login,
  },
  session: {
    strategy: "jwt",
  },
  // jwt: {
  //   secret: "123123"
  //   // secret: process.env.JWT_SECRET
  // }
});
