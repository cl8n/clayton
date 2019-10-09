<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/', function (Request $request, Response $response) {
    return $this->renderer->render($response, 'index.phtml');
});

$app->get('/remove-tapir', function (Request $request, Response $response) {
    return $this->renderer->render($response, 'remove-tapir.phtml');
});
