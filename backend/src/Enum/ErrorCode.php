<?php

namespace App\Enum;

enum ErrorCode: int
{
    case INVALID_REQUEST_DATA = 1;
    case ENTITY_NOT_FOUND = 2;
}
