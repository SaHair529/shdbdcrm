<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class RegisterController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em, private UserPasswordHasherInterface $passwordHasher) { }

    #[Route('/register', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['username'], $data['password'], $data['fullname']))
            return $this->json([
                'message' => 'username, password and fullname are required'
            ], Response::HTTP_BAD_REQUEST);


        $existingUser = $this->em->getRepository(User::class)->findOneBy(['username' => $data['username']]);
        if ($existingUser)
            return new JsonResponse([
                'message' => 'User with such username already exists'
            ], Response::HTTP_CONFLICT);

        $user = new User();
        $user->setUsername($data['username']);
        $user->setFullname($data['fullname']);
        $user->setRoles(['ROLE_USER']);
        
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        $this->em->persist($user);
        $this->em->flush();

        return $this->json(null, Response::HTTP_CREATED);
    }
}
