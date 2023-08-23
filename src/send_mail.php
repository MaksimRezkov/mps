<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$userName = $_POST['user'];
$userOrganization = ($_POST['organization']) ?: 'Не указано';
$userPhone = $_POST['phone'];
$userQuestion = ($_POST['question']) ?: 'Не указано';

$tableTemplate = "
    <table style='width: 50%;'>
        <tbody>
            <tr>
                <td>Клиент:</td>
                <td>${userName}</td>
            </tr>
            <tr>
                <td>Организация:</td>
                <td>${userOrganization}</td>
            </tr>
            <tr>
                <td>Контактный телефон:</td>
                <td>${userPhone}</td>
            </tr>
            <tr>
                <td>Сообщение от пользователя:</td>
                <td>${userQuestion}</td>
            </tr>
        </tbody>
    </table>
";

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer();

try {
    //Server settings
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp.yandex.ru';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->CharSet = "UTF-8";
    $mail->Username   = '';                     // SMTP username
    $mail->Password   = '';                               // SMTP password
    $mail->SMTPSecure = 'ssl';         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
    $mail->Port       = 465;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('', 'Новая заявка с сайта');
    $mail->addAddress('');     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Новая заявка с сайта';
    // $mail->Body    = "Имя пользователя: ${userName}, его телефон: ${userPhone}. Его почта: ${userEmail}";
    $mail->Body    = $tableTemplate;

    $mail->send();
} catch (Exception $e) {
    echo "Письмо не отправлено, есть ошибка. Код ошибки: {$mail->ErrorInfo}";
}