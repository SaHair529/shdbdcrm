<?php

namespace App\Controller;

use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/status')]
class StatusController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[Route('/', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $statuses = $this->em->getRepository(Status::class)->findAll();

        return $this->json($statuses, Response::HTTP_OK, [], ['groups' => 'status_compact']);
    }
}