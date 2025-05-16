<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\AccessTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AuthController extends AbstractController
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private EntityManagerInterface $em,
        private AccessTokenRepository $accessTokenRepository
    ) {}

    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        return $this->json(null);
    }

    #[Route('/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Invalid token'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $tokenValue = substr($authHeader, 7);

        $accessToken = $this->accessTokenRepository->findOneBy(['value' => $tokenValue]);
        if ($accessToken) {
            $this->em->remove($accessToken);
            $this->em->flush();
        }

        $this->tokenStorage->setToken(null);

        return new JsonResponse(null);
    }
}
