<?php

namespace App\Controller;

use App\Entity\Lead;
use App\Entity\Status;
use App\Enum\ErrorCode;
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

        if (isset($requestData['title']) && $requestData['title'])
            $lead->setTitle($requestData['title']);

        if (isset($requestData['fullname']) && $requestData['fullname'])
            $lead->setFullname($requestData['fullname']);

        if (isset($requestData['phone']) && $requestData['phone'])
            $lead->setPhone($requestData['phone']);

        if (isset($requestData['email']) && $requestData['email'])
            $lead->setEmail($requestData['email']);

        if (isset($requestData['status_id']) && $requestData['status_id']) {
            $status = $this->em->getRepository(Status::class)->find($requestData['status_id']);
            if ($status) {
                $lead->setStatus($status);
            }
        }

        if (isset($requestData['description']) && $requestData['description'])
            $lead->setDescription($requestData['description']);

        $this->em->persist($lead);
        $this->em->flush();

        return $this->json(null);
    }

    #[Route('/', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        if (
            !isset($requestData['title'], $requestData['fullname'], $requestData['phone'], $requestData['status_id']) ||
            !$requestData['title'] || !$requestData['fullname'] || !$requestData['phone'] || !$requestData['status_id']
        ) {
            return $this->json([
                'error_message' => 'Invalid request data',
                'error_code' => ErrorCode::INVALID_REQUEST_DATA->value
            ], Response::HTTP_BAD_REQUEST);
        }

        $status = $this->em->getRepository(Status::class)->find($requestData['status_id']);
        if (!$status) {
            return $this->json([
                'error_enum' => 'Status not found',
                'error_code' => ErrorCode::ENTITY_NOT_FOUND->value
            ], Response::HTTP_BAD_REQUEST);
        }

        $lead = new Lead();
        $lead->setTitle($requestData['title'])
            ->setFullname($requestData['fullname'])
            ->setPhone($requestData['phone'])
            ->setStatus($status);

        if (isset($requestData['email']) && $requestData['email'])
            $lead->setEmail($requestData['email']);
        if (isset($requestData['description']) && $requestData['description'])
            $lead->setDescription($requestData['description']);

        $this->em->persist($lead);
        $this->em->flush();

        return $this->json(null, Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $lead = $this->em->getRepository(Lead::class)->find($id);

        $this->em->remove($lead);
        $this->em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}