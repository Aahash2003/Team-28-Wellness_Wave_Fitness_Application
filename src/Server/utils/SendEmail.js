const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host : "smtp.gmail.com",
service :"gmail",
email : 465,
secure : true,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
            
		});
		await transporter.sendMail({
			from: `"Habits Development" <saahash1234@gmail.com>`,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};