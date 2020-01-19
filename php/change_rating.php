<?php

$id_user = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );
$assessment = htmlentities( trim($_POST['assessment']), ENT_QUOTES, 'UTF-8' );

session_start();
if( $assessment >= 1 && $assessment <= 5 && !!$_SESSION['id_user']) {
  
  require_once 'db_connect.php';
  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT `average_rating`, `number_ratings`, `appreciated` FROM `users` WHERE `id_user` = '$id_user'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
      $result = $result[0];

      $average_rating = $result['average_rating'];
      $number_ratings = $result['number_ratings'];
      $appreciated = json_decode($result['appreciated']);

      if( in_array( $_SESSION['id_user'], $appreciated ) ) {
        $response = [
          'status' => 0
        ];
      } else {
        $average_rating = ($average_rating * $number_ratings + $assessment) / ($number_ratings + 1);
        $average_rating = round($average_rating, 4);
        ++$number_ratings;
        $appreciated[] = $_SESSION['id_user'];
        $appreciated = json_encode($appreciated);

        $query_result = mysqli_query($connect, "UPDATE `users` SET `average_rating` = '$average_rating',`number_ratings` = '$number_ratings',`appreciated` = '$appreciated' WHERE `id_user` = '$id_user'");

        if(!$query_result) {
          $response = [
            'status' => 0
          ];
        } else {
          $response = [
            'status' => 1,
            'data' => [
              'average_rating' => round($average_rating, 1),
              'number_ratings' => $number_ratings
            ]
          ];
        }
      }
    }
  }
} else {
  $response = [
    'status' => 0,
    'a' => $assessment
  ];
}

echo json_encode($response);

?>