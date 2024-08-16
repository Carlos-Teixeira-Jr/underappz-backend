import { transporter } from "./transporter/transporter";

const commonStyles = `
.text {
  font-size: 14px;
  color: #666;
}

.small-text {
  font-size: 11px;
  color: #666;
}

.logo {
  width: 300px
}

body {
  display: grid;
  justify-items: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

hr {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.sub-container {
  width: fit-content;
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
`

export const sendEmailVerificationCodeCss = `<style>
.title {
  font-size: 24px;
  color: #F75D5F;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px
}

${commonStyles}

</style>`

const localeLogoLink = '';

export async function sendEmailVerificationCode(
  email: string,
  emailVerificationCode: string,
) {
  const mailOptions = {
    from: 'UnderAppz',
    to: email,
    subject: 'Confirmação de E-mail | UnderAppz',
    html: `
      <html>
        <head>
          ${sendEmailVerificationCodeCss}
        </head>
        <body>
          <div class="container">
            <div class="sub-container">
              <img src=${localeLogoLink} alt="Logotipo da UnderAppz" class="logo">
              <p class="title">Olá, seja bem vindo à UnderAppz!</p>
              <p class="text">Para garantir a segurança da sua conta, precisamos verificar o seu endereço de email.</p>
              <p class="text">Por favor, use o seguinte código de verificação para confirmar o seu cadastro:</p>
              <h1 class="title">${emailVerificationCode}</h1>
              <p class="text">Atenciosamente,</p>
              <p class="text">Equipe UnderAppz</p>
              <hr>
              <p class="small-text">Caso não tenha feito essa solicitação, por favor desconsidere esse email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
  console.log('Email enviado com sucesso!')
}