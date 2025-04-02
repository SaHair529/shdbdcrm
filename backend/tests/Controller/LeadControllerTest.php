<?php

namespace App\Tests\Controller;

use App\Entity\Lead;
use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

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
}
