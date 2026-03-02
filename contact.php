<?php

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars($_POST['nom']);
    $email = htmlspecialchars($_POST['email']);
	$objet = htmlspecialchars($_POST['objet']);
    $message = htmlspecialchars($_POST['message']);

	$mail = new PHPMailer(true);

    
	try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'chacourdeen@gmail.com';
        $mail->Password   = 'vzds cmkb swrs jmyy';   
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

       
        $mail->setFrom($email, $name);
        $mail->addAddress('chacourdeen@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = "<b>Objet:</b> $objet<br>";

        $mail->Body    = "<b>Nom:</b> $name<br><b>Email:</b> $objet<b>Email:</b> $email<br><b>Message:</b><br>$message";

        $mail->send();
        echo "Merci ! Votre message a été envoyé.";
    } catch (Exception $e) {
        echo "Erreur : Le message n'a pas pu être envoyé. Mailer Error: {$mail->ErrorInfo}";
    }
}else {
    echo "Accès interdit";
}
?>