<?php

namespace App\Tests\Controller;

use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class StatusControllerTest extends WebTestCase
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
            ->setColor('black')
            ->setIndex(1);
        $this->em->persist($status);
        $this->em->flush();

        $this->client->request('GET', '/status/');

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());

        $responseData = json_decode($response->getContent(), true);
        $this->assertIsArray($responseData);
        $this->assertNotEmpty($responseData);

        $found = false;
        foreach ($responseData as $item) {
            if ($item['name'] === 'Test Status' && $item['color'] === 'black') {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found);
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
