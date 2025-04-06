<?php

namespace App\Controller;

use App\Entity\Status;
use App\Enum\ErrorCode;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        if (
            !isset($requestData['name'], $requestData['color'], $requestData['index']) ||
            !$requestData['name'] || !$requestData['color'] || !$requestData['index']
        )
        {
            return $this->json([
                'error_message' => 'Invalid request data',
                'error_code' => ErrorCode::INVALID_REQUEST_DATA->value
            ], Response::HTTP_BAD_REQUEST);
        }

        $statuses =  $this->em->getRepository(Status::class)
            ->createQueryBuilder('s')
            ->where('s.index >= :startIndex')
            ->setParameter('startIndex', $requestData['index'])
            ->orderBy('s.index', 'ASC') // Сортировка по возрастанию
            ->getQuery()
            ->getResult();

        foreach ($statuses as $status) {
            $status->setIndex($status->getIndex()+1);
            $this->em->persist($status);
        }
        $this->em->flush();

        $status = new Status();
        $status->setName($requestData['name'])
            ->setColor($requestData['color'])
            ->setIndex($requestData['index']);

        $this->em->persist($status);
        $this->em->flush();

        return $this->json(null, Response::HTTP_CREATED);
    }
}