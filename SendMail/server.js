// go to below given links to create app specific passwords

// https://support.google.com/mail/answer/1173270?hl=en
// https://security.google.com/settings/security/apppasswords

var nodeMailer = require('nodemailer');

var transporter = nodeMailer.createTransport({
	service : 'Gmail',
	auth : {
		user : 'pandey.kishore@gmail.com',
		pass : 'swiv yqfj gtyu zhsk'
	}
});

var mailOptions = {
	from : '<kamal.pandey@gmail.com>',
	to : 'pandey.kishore@gmail.com',
	subject : 'Hello',
	text : 'Hello World',
	html : 'Hello World'
};

transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Message send: ' + info.response);
	}
});
