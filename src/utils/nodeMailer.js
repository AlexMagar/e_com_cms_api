import nodemailer from 'nodemailer'

// 2. email body
// 3. send method

export const accountVerificationEmail = async (obj) =>{
    const {email, fName, link} = obj

    // 1. smtp config
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

     // send mail with defined transport object
    const info = await transporter.sendMail({
    from: `"EST Store 👻" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Account activation required ✔", // Subject line
    text: `Hello ${fName}, Please follow the link to activate the account ${link}`, // plain text body
    html:`
    <p>Hello ${fName}</p>
    <p>Please follow the link below to activate the account</p>
    <br />
    <br />
    <p><a href=${link}>${link}</a> </p>
    <br />
    <br />
    <p>
        Regards, <br/>
        EST Store <br/>
        Customer Support Team
    </p>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId)
}

export const accountVerifiedNotification = async (obj) =>{
    const {email, fName} = obj;

    //1. smtp config
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    })

    //send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"EST Store " <${process.env.SMTP_USER}>`, //sender address
        to: email, //list of reveivers
        subject: "Account has been verified", //subject line
        text: `hello ${fName}, Your account has been verified you may signin now `, //plain text body
        html: `
        <p> Hello ${fName}</p>
        <p>Your account has been verified, you may <a href='${process.env.WEB_DOMAIN}'>sign</a> in now  </p> 
        <br />
        <br />

        <p>
            Regards, <br />
            EST Store <br />
            Customer Support Team
        </p>
        `   //html body
    })
    console.log("Message sent: %s", info.messageId)
}

