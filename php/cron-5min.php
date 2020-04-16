<?php

  require_once 'db_connect.php';

  $now = time();

  $query_result = mysqli_query($connect, "UPDATE `tasks` SET `status` = 4 WHERE `date_completion` <= '$now' AND `status` = 1");

?>