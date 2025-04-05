<?php

namespace App\Tests\Controller;

use App\Entity\Lead;
use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class LeadControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = self::$kernel->getContainer()->get('doctrine.orm.entity_manager');
    }

    public function testList(): void
    {
        $status = new Status();
        $status->setName('Test Status')
            ->setColor('black');

        $lead = new Lead();
        $lead->setTitle('Test Lead')
            ->setFullname('Test Lead')
            ->setDescription('Test Lead')
            ->setPhone('0123456789')
            ->setEmail('test@test.com')
            ->setStatus($status);

        $this->em->persist($lead);
        $this->em->flush();

        $this->client->request('GET', '/lead/');

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());

        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertNotEmpty($responseData);

        $found = false;
        foreach ($responseData as $item) {
            if ($item['id'] === $lead->getId()) {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found);
    }

    public function testPatch(): void
    {
        $status1 = new Status();
        $status1->setName('status1')
            ->setColor('black');
        $status2 = new Status();
        $status2->setName('status2')
            ->setColor('white');

        $lead = new Lead();
        $lead->setTitle('Test Lead')
            ->setFullname('Test Lead')
            ->setDescription('Test Lead')
            ->setPhone('0123456789')
            ->setEmail('test@test.com')
            ->setStatus($status1);

        $this->em->persist($lead);
        $this->em->persist($status2);
        $this->em->flush();

        $this->assertequals($lead->getStatus()->getId(), $status1->getId());

        $this->client->request('PATCH', "/lead/{$lead->getId()}", [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'status_id' => $status2->getId(),
        ]));
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());

        $lead = $this->em->getRepository(Lead::class)->find($lead->getId());
        $this->assertequals($lead->getStatus()->getId(), $status2->getId());
    }

    public function testCreate(): void
    {
        $status = new Status();
        $status->setName('Test Status')
            ->setColor('black');

        $this->em->persist($status);
        $this->em->flush();

        $requestData = [
            'title' => 'Test Lead 124325326315',
            'fullname' => 'Test Lead 124325326315',
            'phone' => '0123456406',
            'status_id' => $status->getId(),
        ];

        $this->client->request('POST', '/lead/', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestData));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());

        $lead = $this->em->getRepository(Lead::class)->findOneBy(['title' => $requestData['title']]);
        $this->assertnotnull($lead);
        $this->assertEquals($requestData['title'], $lead->getTitle());
        $this->assertEquals($requestData['fullname'], $lead->getFullname());
        $this->assertEquals($requestData['phone'], $lead->getPhone());
        $this->assertEquals($requestData['status_id'], $lead->getStatus()->getId());
    }

    public function testDelete(): void
    {
        $status = new Status();
        $status->setName('Test Status')
            ->setColor('black');

        $lead = new Lead();
        $lead->setTitle('Test Lead');
        $lead->setFullname('Test Lead');
        $lead->setEmail('test@test.com');
        $lead->setPhone('0123456789');
        $lead->setstatus($status);

        $this->em->persist($lead);
        $this->em->flush();

        $leadId = $lead->getId();

        $this->client->request('DELETE', "/lead/{$leadId}");

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_NO_CONTENT, $response->getStatusCode());

        $lead = $this->em->getRepository(Lead::class)->find($leadId);
        $this->assertNull($lead);
    }

    public function tearDown(): void
    {
        $statuses = $this->em->getRepository(Status::class)->findAll();
        foreach ($statuses as $status) {
            foreach ($status->getLeads() as $lead) {
                $this->em->remove($lead);
            }
            $this->em->remove($status);
        }
        $this->em->flush();

        parent::tearDown();
    }
}
