<?php

namespace App\Security;

use App\Entity\AccessToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class Authenticator extends AbstractAuthenticator
{
    public function __construct(private EntityManagerInterface $em, private TokenStorageInterface $tokenStorage)
    {
    }

    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     */
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login' && $request->isMethod(Request::METHOD_POST);
    }

    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['username']) || !isset($data['password']))
            throw new AuthenticationException('Missing "username" or "password" parameter.');

        return new Passport(
            new UserBadge($data['username']),
            new PasswordCredentials($data['password'])
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $user  = $token->getUser();
        $tokenValue = bin2hex(random_bytes(16));

        $accessToken = new AccessToken();
        $accessToken->setOwner($user);
        $accessToken->setValue($tokenValue);

        $this->em->persist($accessToken);
        $this->em->flush();

        $usernamePasswordToken = new UsernamePasswordToken($user, $firewallName, $user->getRoles());
        $this->tokenStorage->setToken($usernamePasswordToken);

        return new JsonResponse([
            'accessToken' => $tokenValue
        ]);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'error' => $exception->getMessage()
        ], Response::HTTP_UNAUTHORIZED);
    }
}
