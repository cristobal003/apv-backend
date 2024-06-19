import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;
  //Enviar el email
  const info = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Restablece tu Contraseña",
    text: "Restablece tu Contraseña",
    html: `<html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu Contraseña</title>
      <style>
        body { background-color: #f7fafc; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; background-color: #4c51bf; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h1 { font-size: 24px; font-weight: bold; }
        .content { padding: 20px; color: #2d3748; }
        .content p { margin: 10px 0; }
        .btn { display: inline-block; background-color: #4c51bf; color: #ffffff; padding: 10px 20px; margin-top: 20px; border-radius: 5px; text-decoration: none; }
        .btn:hover { background-color: #434190; }
        .footer { text-align: center; color: #a0aec0; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verificación de Cuenta</h1>
        </div>
        <div class="content">
          <p>Hola, <strong>${nombre}</strong></p>
          <p>Restablece tu Contraseña en APV.</p>
          <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" class="btn">Reestablecer</a>
        </div>
        <div class="footer">
          <p>&copy; 2023 APV. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>`,
  });

  console.log("mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;
