<?php

  require 'recaptchalib.php';

  $data = &$_POST;

  $re = new ReCaptcha('6LcQJcQUAAAAAHrxqW8VgIJMCdMboSjVAvqmcxhs');
  $reResult = $re->verifyResponse($_SERVER['REMOTE_ADDR'], $data['g-recaptcha-response']);

  if($reResult->success) {
    exit('You are men');
  } else {
    exit('You are bot');
  }

?>