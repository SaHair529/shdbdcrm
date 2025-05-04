<?php

namespace App\Security;

use App\Repository\AccessTokenRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class TokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(private AccessTokenRepository $accessTokenRepository)
    {
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        $token = $this->accessTokenRepository->findOneBy(['value' => $accessToken]);

        if (!$token || !$token->isValid()) {
            throw new BadCredentialsException('Invalid token');
        }

        return new UserBadge($token->getOwner()->getUserIdentifier());
    }
}