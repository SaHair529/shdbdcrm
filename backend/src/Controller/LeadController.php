<?php

namespace App\Controller;

use App\Entity\Lead;
use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/lead')]
class LeadController extends AbstractController
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    #[Route('/', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $leads = $this->em->getRepository(Lead::class)->findAll();

        return $this->json($leads, Response::HTTP_OK, [], [
            'groups' => ['lead_compact']
        ]);
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function patch(int $id, Request $request): JsonResponse
    {
        $lead = $this->em->getRepository(Lead::class)->find($id);
        if (!$lead) {
            return $this->json(['message' => 'Lead not found'], Response::HTTP_NOT_FOUND);
        }

        $requestData = json_decode($request->getContent(), true);
        if (isset($requestData['status_id'])) {
            $status = $this->em->getRepository(Status::class)->find($requestData['status_id']);
            if ($status) {
                $lead->setStatus($status);
            }
        }

        $this->em->persist($lead);
        $this->em->flush();

        return $this->json(null);
    }
}