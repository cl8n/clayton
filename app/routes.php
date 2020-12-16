<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/gimmedatsong/{videoId}', function (Request $request, Response $response, $args) {
    if (!preg_match('/^[a-z0-9_-]{11}$/i', $args['videoId'])) {
        return 'invalid video id';
    }

    $filename = mb_substr(shell_exec('youtube-dl -f bestaudio --get-filename ' . $args['videoId']), 0, -1);

    if (!file_exists('gimmedatsongstorage/' . $filename)) {
        $output = shell_exec('cd gimmedatsongstorage && youtube-dl -f bestaudio ' . $args['videoId']);
    }

    return $response->withRedirect('/gimmedatsongstorage/' . rawurlencode($filename), 302);
});
