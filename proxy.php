<?php
  header("Content-type: text/xml\n\n");
  $host = "http://www.zillow.com/webservice/GetSearchResults.htm";
  $query = $_SERVER['QUERY_STRING'];
  $ch = curl_init($host . "?" . $query);
  curl_exec($ch);
  curl_close($ch);
?>
