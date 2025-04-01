<?php

namespace App\Controller;

use App\Entity\Lead;
use App\Repository\LeadRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/lead')]
class LeadController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[Route('/', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $leads = $this->em->getRepository(Lead::class)->findAll();

        return $this->json($leads);
    }
}